import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AnalyticsModule } from '../../analytics/analytics.module';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Module({
  imports: [
    AnalyticsModule, // On importe pour avoir accès à AnalyticsRepository
    TypeOrmModule.forFeature([Establishment]), // Pour injecter EstablishmentRepository
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}