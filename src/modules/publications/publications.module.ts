import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Publisher } from './entities/publisher.entity';
import { Publication } from './entities/publication.entity';
import { PublicationsRepository } from './publications.repository'; // <-- AJOUTER CET IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Publisher, Publication]),
  ],
  // =======================================================
  // ==                 CORRECTION ICI                    ==
  // =======================================================
  providers: [PublicationsRepository], // Déclarer le repository comme provider
  exports: [PublicationsRepository],   // Exporter le repository
})
export class PublicationsModule {}