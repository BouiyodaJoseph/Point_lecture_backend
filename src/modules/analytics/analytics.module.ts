import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnalyticsRepository } from './analytics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEvent])],
  providers: [AnalyticsRepository],
  exports: [AnalyticsRepository], // Exporter pour que d'autres modules puissent l'utiliser
})
export class AnalyticsModule {}