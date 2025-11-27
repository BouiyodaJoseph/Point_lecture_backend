import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReadingService } from './reading.service';
import { ReadingController } from './reading.controller';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { PublicationsModule } from '../../publications/publications.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    // Requis car ReadingService et ContentService ont besoin
    // d'injecter le EstablishmentRepository.
    TypeOrmModule.forFeature([Establishment]),

    // On importe ce module pour avoir accès au PublicationsRepository
    // qui est exporté par PublicationsModule.
    PublicationsModule,
  ],
  // On déclare les deux contrôleurs pour ce flux
  controllers: [ReadingController, ContentController],
  // On déclare les deux services
  providers: [ReadingService, ContentService],
})
export class ReadingModule {}