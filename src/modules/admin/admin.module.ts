import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entités utilisées par les services de ce module
import { Establishment } from '../establishments/entities/establishment.entity';
import { User } from '../users/entities/user.entity';
import { PublicationPack } from '../packs/entities/publication-pack.entity';
import { Publication } from '../publications/entities/publication.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';

// Contrôleurs de la section Admin
import { AdminEstablishmentsController } from './admin-establishments.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminPacksController } from './admin-packs.controller';
import { AdminSubscriptionsController } from './admin-subscriptions.controller';

import { AdminPublicationsController } from './admin-publications.controller';

// Services de la section Admin
import { AdminEstablishmentsService } from './admin-establishments.service';
import { AdminUsersService } from './admin-users.service';
import { AdminPacksService } from './admin-packs.service';
import { AdminSubscriptionsService } from './admin-subscriptions.service';

import { AdminPublicationsService } from './admin-publications.service';
@Module({
  imports: [
    // Rend les repositories pour ces entités injectables dans ce module
    TypeOrmModule.forFeature([
      Establishment,
      User,
      PublicationPack,
      Publication,
      Subscription, // <-- ENTITÉ AJOUTÉE
    ]),
  ],
  // Déclare tous les contrôleurs qui appartiennent à la section admin
  controllers: [
    AdminEstablishmentsController,
    AdminUsersController,
    AdminPacksController,
    AdminSubscriptionsController, // <-- CONTRÔLEUR AJOUTÉ
    AdminPublicationsController // <-- AJOUTER LE DERNIER CONTRÔLEUR
  ],
  // Déclare tous les services qui appartiennent à la section admin
  providers: [
    AdminEstablishmentsService,
    AdminUsersService,
    AdminPacksService,
    AdminSubscriptionsService, // <-- SERVICE AJOUTÉ
    AdminPublicationsService // <-- AJOUTER LE DERNIER SERVICE
  ],
})
export class AdminModule {}
