import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns'; // Librairie populaire et robuste pour manipuler les dates
import { AnalyticsRepository } from '../../analytics/analytics.repository';
import { PartnerDashboardDto } from './dto/partner-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async getDashboardData(establishmentId: string, period: string): Promise<PartnerDashboardDto> {
    // 1. Déterminer la période de temps
    const endDate = new Date();
    const startDate = this.calculateStartDate(period, endDate);

    // 2. Appeler les méthodes du repository en parallèle pour la performance.
    // C'est l'un des plus grands avantages de Node.js pour ce genre de cas.
    const [
      totalScans,
      totalReadings,
      topCategories,
      topPublishers,
    ] = await Promise.all([
      this.analyticsRepository.countEvents(establishmentId, 'SESSION_CREATED', startDate, endDate),
      this.analyticsRepository.countEvents(establishmentId, 'PUBLICATION_VIEWED', startDate, endDate),
      this.analyticsRepository.findTopCategories(establishmentId, startDate, endDate),
      this.analyticsRepository.findTopPublishers(establishmentId, startDate, endDate),
    ]);

    // 3. Construire le DTO de réponse
    return {
      totalScans,
      totalReadings,
      topCategories,
      topPublishers,
    };
  }

  private calculateStartDate(period: string, endDate: Date): Date {
    if ('LAST_30_DAYS'.toUpperCase() === period.toUpperCase()) {
      return subDays(endDate, 30);
    }
    // Par défaut, on retourne les 7 derniers jours.
    return subDays(endDate, 7);
  }
}