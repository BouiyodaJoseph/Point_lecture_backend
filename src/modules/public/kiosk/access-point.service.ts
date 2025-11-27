import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.provider';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { QrCodeService } from './qrcode.service';

@Injectable()
export class AccessPointService {
  private readonly frontendBaseUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly qrCodeService: QrCodeService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    // On récupère d'abord la variable
    const baseUrl = this.configService.get<string>('FRONTEND_BASE_URL');
    
    // On vérifie qu'elle existe avant de continuer
    if (!baseUrl) {
      throw new Error('La variable d\'environnement FRONTEND_BASE_URL est manquante. L\'application ne peut pas démarrer.');
    }

    // Si elle existe, on l'assigne
    this.frontendBaseUrl = baseUrl;
  }
  
  async generateNewAccessPoint(establishment: Establishment) {
    const kioskToken = this.generateKioskToken(establishment.id);
    
    const accessUrl = `${this.frontendBaseUrl}/geocheck?token=${kioskToken}`;
    
    const [qrCodeBase64, sixDigitCode] = await Promise.all([
        this.qrCodeService.generateQrCodeBase64(accessUrl),
        this.generateAndStoreSixDigitCode(kioskToken)
    ]);
    
    return {
        qrCodeImage: qrCodeBase64,
        sixDigitCode: sixDigitCode,
        expiresIn: 600,
        rawJwt: kioskToken,
    };
  }

  private generateKioskToken(establishmentId: string): string {
    return this.jwtService.sign({ eid: establishmentId }, { expiresIn: '10m' });
  }
  
  private async generateAndStoreSixDigitCode(jwt: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `six_digit_code:${code}`;
    await this.redis.set(redisKey, jwt, 'EX', 600);
    return code;
  }
}