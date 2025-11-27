import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../auth/decorators/public.decorator';
import { SessionOrchestrationService } from './session-orchestration.service';
import { GeoValidationRequestDto } from './dto/geo-validation.dto';
import { ValidateCodeRequestDto } from './dto/validate-code.dto';

@Controller('/api/v1/public/session')
@Public() // Marque toutes les routes de ce contrôleur comme publiques
export class SessionController {
  private readonly frontendBaseUrl: string;

  constructor(
    private readonly sessionOrchestrationService: SessionOrchestrationService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('FRONTEND_BASE_URL');
    if (!baseUrl) {
      throw new Error('La variable d\'environnement FRONTEND_BASE_URL est manquante.');
    }
    this.frontendBaseUrl = baseUrl;
  }

  /**
   * Point d'entrée pour un scan de QR Code.
   * Reçoit le JWT via l'URL et redirige le navigateur de l'utilisateur
   * vers la page du frontend qui gère la géolocalisation.
   */
  @Get('initiate/:jwt')
  initiateSession(@Param('jwt') jwt: string, @Res() res: Response) {
    // On utilise la variable d'environnement pour construire l'URL de redirection
    const geocheckUrl = `${this.frontendBaseUrl}/geocheck?token=${jwt}`;
    return res.redirect(302, geocheckUrl);
  }

  /**
   * Valide les coordonnées GPS de l'utilisateur et le token.
   */
  @Post('geovalidate')
  async geoValidate(@Body() body: GeoValidationRequestDto) {
    const redirectUrl =
      await this.sessionOrchestrationService.validatePositionAndCreateSession(
        body.token,
        body.latitude,
        body.longitude,
      );
    return { redirectUrl };
  }

  /**
   * Valide un code à 6 chiffres entré manuellement par l'utilisateur.
   */
  @Post('validate-code')
  async validateCode(@Body() body: ValidateCodeRequestDto) {
    const redirectUrl =
      await this.sessionOrchestrationService.getUrlForSixDigitCode(body.code);
    return { redirectUrl };
  }
}
