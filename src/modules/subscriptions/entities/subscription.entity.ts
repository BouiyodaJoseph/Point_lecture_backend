import { User } from '../../users/entities/user.entity';
import { PublicationPack } from '../../packs/entities/publication-pack.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {  nullable: false, onDelete: 'CASCADE' }) //lazy: true,
  @JoinColumn({ name: 'partner_id' })
  partner: User;

  @ManyToOne(() => PublicationPack, {  nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pack_id' }) //lazy: true,
  pack: PublicationPack;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;
}   