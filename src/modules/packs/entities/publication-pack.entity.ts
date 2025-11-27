import { Publication } from '../../publications/entities/publication.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'publication_packs' })
export class PublicationPack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Publication) //, { lazy: true }
  @JoinTable({
    name: 'pack_publications', // Nom de la table de jointure
    joinColumn: { name: 'pack_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'publication_id', referencedColumnName: 'id' },
  })
  publications: Publication[];
}