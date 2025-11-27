import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany, // <-- NOUVEL IMPORT
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publisher } from './publisher.entity';
import { Category } from './category.entity';
// =======================================================
// ==                 NOUVEL IMPORT                     ==
// =======================================================
import { PublicationPack } from '../../packs/entities/publication-pack.entity';

@Entity({ name: 'publications' })
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @ManyToOne(() => Publisher, {  onDelete: 'SET NULL' }) //lazy: true,
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' }) // lazy: true,
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // =======================================================
  // ==                LA CORRECTION FINALE               ==
  // =======================================================
  /**
   * Définit la relation inverse ManyToMany.
   * Une publication peut appartenir à plusieurs packs.
   * Le deuxième argument `(pack) => pack.publications` indique à TypeORM
   * de regarder la propriété `publications` de l'entité `PublicationPack`
   * pour trouver la configuration de la table de jointure.
   */
  @ManyToMany(() => PublicationPack, (pack) => pack.publications)
  packs: PublicationPack[];
}