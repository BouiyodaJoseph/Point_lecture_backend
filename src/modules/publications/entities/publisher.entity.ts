import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'publishers' })
export class Publisher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;
}