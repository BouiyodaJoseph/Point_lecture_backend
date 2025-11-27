import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionOrchestrationService } from './session-orchestration.service';
import { SessionController } from './session.controller';
import { GeoValidationService } from './geo-validation.service';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Module({
  imports: [
    // Requis car GeoValidationService et SessionOrchestrationService
    // ont besoin d'injecter le EstablishmentRepository.
    TypeOrmModule.forFeature([Establishment]),
  ],
  controllers: [SessionController],
  providers: [SessionOrchestrationService, GeoValidationService],
})
export class SessionModule {}