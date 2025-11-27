import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/user.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { MySpaceService } from './my-space.service';
import { EstablishmentResponseDto } from '../../admin/dto/establishment.response.dto';
import { MySubscriptionResponseDto } from './dto/my-subscription.response.dto';

@Controller('/api/v1/partner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_PARTNER', 'ROLE_ADMIN') // Autorise les partenaires et les admins (pour le débogage/impersonation)
export class MySpaceController {
  constructor(private readonly mySpaceService: MySpaceService) {}

  /**
   * Récupère la liste des établissements appartenant au partenaire connecté.
   */
  @Get('establishments/my-list')
  async getMyEstablishments(
    @GetUser() user: JwtPayload,
  ): Promise<EstablishmentResponseDto[]> {
    const establishments = await this.mySpaceService.findEstablishmentsByPartner(
      user.sub,
    );
    // On mappe les entités vers un DTO de réponse pour contrôler la forme des données
    // et éviter les problèmes de sérialisation des relations lazy.
    return establishments.map(e => ({
      id: e.id,
      name: e.name,
      apiKey: e.apiKey,
      latitude: e.latitude,
      longitude: e.longitude,
      geofenceRadius: e.geofenceRadius,
      partnerId: user.sub, // On sait déjà qui est le partenaire
      partnerEmail: user.email, // L'email est dans le token, pas besoin de charger l'entité user
    }));
  }

  /**
   * Récupère la liste des abonnements actifs pour le partenaire connecté.
   */
  @Get('subscriptions/my-active')
  async getMySubscriptions(
    @GetUser() user: JwtPayload,
  ): Promise<MySubscriptionResponseDto[]> {
    const subscriptions = await this.mySpaceService.findSubscriptionsByPartner(
      user.sub,
    );
    // On doit utiliser Promise.all car l'accès à `s.pack` est asynchrone (relation lazy)
    return Promise.all(
      subscriptions.map(async s => {
        const pack = await s.pack; // On "réveille" la relation lazy
        return {
          packId: pack.id,
          packName: pack.name,
          endDate: s.endDate,
        };
      }),
    );
  }
}