import { Inject, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { randomUUID } from 'crypto';

import { GeoValidationService } from './geo-validation.service';
import { REDIS_CLIENT } from '../../redis/redis.provider';

@Injectable()
export class SessionOrchestrationService {
  private readonly logger = new Logger(SessionOrchestrationService.name);
  private readonly frontendBaseUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly geoValidationService: GeoValidationService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = configService.get<string>('FRONTEND_BASE_URL');
    if (!baseUrl) {
      throw new Error('La variable d\'environnement FRONTEND_BASE_URL est manquante.');
    }
    this.frontendBaseUrl = baseUrl;
  }

  /**
   * Valide un token de kiosque, vérifie la position de l'utilisateur et crée une session de lecture.
   */
  async validatePositionAndCreateSession(
    token: string,
    latitude: number,
    longitude: number,
  ): Promise<string> {
    try {
      const decodedJwt = this.jwtService.verify(token);
      const establishmentId = decodedJwt.eid;
      if (!establishmentId) {
        throw new Error('Token invalide : ID d\'établissement (eid) manquant.');
      }

      const tokenSignature = token.split('.')[2];
      const tokenSignatureKey = `used_token:${tokenSignature}`;
      if (await this.redis.get(tokenSignatureKey)) {
        throw new Error('Token invalide : déjà utilisé.');
      }

      const isValidPosition = await this.geoValidationService.isPositionValid(
        establishmentId,
        latitude,
        longitude,
      );
      if (!isValidPosition) {
        throw new UnauthorizedException('Position géographique invalide.');
      }
      
      const sessionId = randomUUID();
      const sessionKey = `user_session:${sessionId}`;
      await this.redis.set(sessionKey, establishmentId, 'EX', 1800);
      await this.redis.set(tokenSignatureKey, 'true', 'EX', 900);
      
      this.logger.log(`Session créée avec succès: ${sessionId} pour l'établissement ${establishmentId}`);

      // On utilise la variable d'environnement pour construire l'URL de retour
      return `${this.frontendBaseUrl}/reading?session_id=${sessionId}`;

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.warn(`Échec de la validation de session : ${error.message}`);
        throw error;
      }
      this.logger.error(`Erreur inattendue lors de la validation du token: ${error.message}`);
      throw new UnauthorizedException('Token invalide ou expiré.');
    }
  }

  /**
   * Valide un code à 6 chiffres et retourne l'URL de géovérification.
   */
  async getUrlForSixDigitCode(code: string): Promise<string> {
    const redisKey = `six_digit_code:${code.replace('-', '')}`;
    const jwt = await this.redis.get(redisKey);

    if (!jwt) {
      throw new UnauthorizedException('Code invalide ou expiré.');
    }

    // On utilise la variable d'environnement pour construire l'URL de retour
    return `${this.frontendBaseUrl}/geocheck?token=${jwt}`;
  }
}