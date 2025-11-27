import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
// CORRECTION : Importer depuis le nouveau fichier
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET_KEY');

    if (!secret) {
      throw new Error('La variable d\'environnement JWT_SECRET_KEY est manquante. L\'application ne peut pas démarrer.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // L'interface JwtPayload est maintenant importée
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { sub: payload.sub, name: payload.name, role: payload.role, email: payload.email };
  }
}