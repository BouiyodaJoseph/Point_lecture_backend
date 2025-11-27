import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'establishments' })
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => User, { lazy: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partner_id' })
  partner: User;

  @Column({ unique: true, nullable: false })
  apiKey: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  geofenceRadius: number;
}