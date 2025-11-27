import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'analytics_events' })
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  establishmentId: string;

  @Column()
  eventType: string;

  @Column({ type: 'jsonb', nullable: true }) // Utiliser le type JSONB de Postgres
  eventData: Record<string, any>;

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;
}