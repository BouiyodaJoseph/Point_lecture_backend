import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Publication } from '../publications/entities/publication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminPublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
  ) {}

  findAll(): Promise<Publication[]> {
    // Pour l'instant, on retourne l'entité complète. Le frontend s'attend à un PublicationSummaryDto,
    // mais les champs (id, title) sont compatibles.
    return this.publicationRepository.find();
  }
}