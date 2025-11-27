import { StatItemDto } from './stat-item.dto';

// Ce DTO représente l'objet complet retourné par l'endpoint du dashboard
export class PartnerDashboardDto {
  totalScans: number;
  totalReadings: number;
  topCategories: StatItemDto[];
  topPublishers: StatItemDto[];
}