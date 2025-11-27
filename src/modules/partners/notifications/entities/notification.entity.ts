import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from '../../../users/entities/user.entity';
  
  @Entity({ name: 'notifications' })
  export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Si l'utilisateur est supprimé, ses notifications le sont aussi
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ nullable: false })
    message: string;
  
    @Column({ nullable: true })
    link: string;
  
    @Column({ default: false })
    isRead: boolean;
  
    @Column({ type: 'timestamp with time zone' })
    createdAt: Date;
  }
  // //"@liaoliaots/nestjs-redis": "^10.0.0",
  //"@nestjs/schedule": "^4.1.0", "passport-headerapikey": "^1.2.2",