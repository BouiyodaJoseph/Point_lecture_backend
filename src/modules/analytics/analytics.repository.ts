import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between } from 'typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { StatItemDto } from '../partners/dashboard/dto/stat-item.dto';

@Injectable()
export class AnalyticsRepository extends Repository<AnalyticsEvent> {
  constructor(private dataSource: DataSource) {
    super(AnalyticsEvent, dataSource.createEntityManager());
  }

  /**
   * Équivalent de: countByEstablishmentIdAndEventTypeAndTimestampBetween
   */
  countEvents(
    establishmentId: string,
    eventType: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.count({
      where: {
        establishmentId,
        eventType,
        timestamp: Between(startDate, endDate),
      },
    });
  }

  /**
   * Traduction de: findTopCategories (requête native) avec le QueryBuilder
   */
  async findTopCategories(establishmentId: string, startDate: Date, endDate: Date): Promise<StatItemDto[]> {
    const rawResults = await this.createQueryBuilder('ae') // 'ae' est l'alias pour analytics_events
      .select('c.name', 'name')
      .addSelect('COUNT(ae.id)', 'value')
      .innerJoin('publications', 'p', "CAST(ae.eventData ->> 'publicationId' AS uuid) = p.id")
      .innerJoin('categories', 'c', 'p.category_id = c.id')
      .where('ae.establishmentId = :establishmentId', { establishmentId })
      .andWhere("ae.eventType = 'PUBLICATION_VIEWED'")
      .andWhere('ae.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('c.name')
      .orderBy('value', 'DESC')
      .limit(5) // Optionnel: Limiter aux 5 meilleurs résultats
      .getRawMany(); // Exécute et retourne des objets bruts { name: '...', value: '...' }

    // Le résultat de COUNT est une chaîne de caractères, il faut le parser en nombre.
    return rawResults.map(r => ({ name: r.name, value: parseInt(r.value, 10) }));
  }

  /**
   * Traduction de: findTopPublishers (requête native) avec le QueryBuilder
   */
  async findTopPublishers(establishmentId: string, startDate: Date, endDate: Date): Promise<StatItemDto[]> {
     const rawResults = await this.createQueryBuilder('ae')
      .select('pub.name', 'name')
      .addSelect('COUNT(ae.id)', 'value')
      .innerJoin('publications', 'p', "CAST(ae.eventData ->> 'publicationId' AS uuid) = p.id")
      .innerJoin('publishers', 'pub', 'p.publisher_id = pub.id')
      .where('ae.establishmentId = :establishmentId', { establishmentId })
      .andWhere("ae.eventType = 'PUBLICATION_VIEWED'")
      .andWhere('ae.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('pub.name')
      .orderBy('value', 'DESC')
      .limit(5)
      .getRawMany();

    return rawResults.map(r => ({ name: r.name, value: parseInt(r.value, 10) }));
  }
}