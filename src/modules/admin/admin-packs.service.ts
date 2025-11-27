import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PublicationPack } from '../packs/entities/publication-pack.entity';
import { Publication } from '../publications/entities/publication.entity';
import { PackUpdateDto } from './dto/pack-update.dto';

@Injectable()
export class AdminPacksService {
  constructor(
    @InjectRepository(PublicationPack)
    private readonly packRepository: Repository<PublicationPack>,
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
  ) {}

  /**
   * Crée un nouveau pack de publications.
   * @param dto Les données pour la création.
   * @returns Le pack nouvellement créé avec ses publications.
   */
  async create(dto: PackUpdateDto): Promise<PublicationPack> {
    const publications = await this.publicationRepository.findBy({
      id: In(dto.publicationIds),
    });

    const newPack = this.packRepository.create({
      name: dto.name,
      publications: publications,
    });

    const savedPack = await this.packRepository.save(newPack);
    // On recharge pour s'assurer que les relations sont bien présentes
    return this.findOne(savedPack.id);
  }

  /**
   * Retourne tous les packs avec leurs publications.
   * @returns Une liste de packs.
   */
  findAll(): Promise<PublicationPack[]> {
    return this.packRepository.find({
      relations: {
        publications: true,
      },
    });
  }

  /**
   * Trouve un pack par son ID.
   * @param id L'ID du pack.
   * @returns Le pack trouvé avec ses publications.
   */
  async findOne(id: string): Promise<PublicationPack> {
    const pack = await this.packRepository.findOne({
      where: { id },
      relations: {
        publications: true,
      },
    });
    if (!pack) {
      throw new NotFoundException(`Pack avec l'ID ${id} non trouvé.`);
    }
    return pack;
  }

  /**
   * Met à jour un pack existant.
   * @param id L'ID du pack à mettre à jour.
   * @param dto Les nouvelles données.
   * @returns Le pack mis à jour.
   */
  async update(id: string, dto: PackUpdateDto): Promise<PublicationPack> {
    // On charge le pack existant
    const pack = await this.findOne(id);

    // On charge les nouvelles publications
    const publications = await this.publicationRepository.findBy({
      id: In(dto.publicationIds),
    });

    // On met à jour les propriétés
    pack.name = dto.name;
    pack.publications = publications;

    // On sauvegarde et on retourne le pack mis à jour
    return this.packRepository.save(pack);
  }

  /**
   * Supprime un pack.
   * @param id L'ID du pack à supprimer.
   */
  async remove(id: string): Promise<void> {
    const result = await this.packRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pack avec l'ID ${id} non trouvé.`);
    }
  }
}