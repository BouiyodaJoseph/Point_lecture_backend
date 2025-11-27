import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { Establishment } from '../establishments/entities/establishment.entity';
import { User } from '../users/entities/user.entity';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentResponseDto } from './dto/establishment.response.dto';

@Injectable()
export class AdminEstablishmentsService {
  private readonly logger = new Logger(AdminEstablishmentsService.name);

  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateEstablishmentDto): Promise<EstablishmentResponseDto> {
    const partner = await this.userRepository.findOneBy({ id: createDto.partnerId });
    if (!partner) {
      throw new BadRequestException(`Partenaire avec l'ID ${createDto.partnerId} non trouvé.`);
    }

    const newEstablishment = this.establishmentRepository.create({
      ...createDto,
      partner: partner,
      apiKey: crypto.randomUUID(),
    });

    const savedEntity = await this.establishmentRepository.save(newEstablishment);
    const fullEntityWithRelation = await this.findOneEntity(savedEntity.id);
    return this.mapEntityToDto(fullEntityWithRelation);
  }

  async findAll(): Promise<EstablishmentResponseDto[]> {
    const establishments = await this.establishmentRepository.find({
      relations: { partner: true },
    });
    // Utiliser Promise.all pour résoudre toutes les relations lazy en parallèle
    return Promise.all(establishments.map(entity => this.mapEntityToDto(entity)));
  }

  async findOne(id: string): Promise<EstablishmentResponseDto> {
    const establishment = await this.findOneEntity(id);
    return this.mapEntityToDto(establishment);
  }
  
  async update(id: string, updateDto: UpdateEstablishmentDto): Promise<EstablishmentResponseDto> {
    const existingEntity = await this.findOneEntity(id);
    const updatedPartialEntity = this.establishmentRepository.merge(existingEntity, updateDto);
    const savedEntity = await this.establishmentRepository.save(updatedPartialEntity);
    const fullEntityWithRelation = await this.findOneEntity(savedEntity.id);
    return this.mapEntityToDto(fullEntityWithRelation);
  }
  
  async remove(id: string): Promise<void> {
    const result = await this.establishmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Établissement non trouvé avec l'ID: ${id}`);
    }
  }

  private async findOneEntity(id: string): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: { partner: true },
    });
    if (!establishment) {
      throw new NotFoundException(`Établissement non trouvé avec l'ID: ${id}`);
    }
    return establishment;
  }

  // =======================================================
  // ==             CORRECTION FINALE ET DÉFINITIVE       ==
  // =======================================================
  private async mapEntityToDto(entity: Establishment): Promise<EstablishmentResponseDto> {
    // On accède à la propriété `partner`. Comme elle est lazy, TypeORM
    // va retourner une Promise qui se résoudra avec l'objet User.
    // L'opérateur `await` attend que cette Promise soit résolue.
    const partner = await entity.partner;

    return {
      id: entity.id,
      name: entity.name,
      apiKey: entity.apiKey,
      latitude: entity.latitude,
      longitude: entity.longitude,
      geofenceRadius: entity.geofenceRadius,
      // Maintenant que `partner` est l'objet User résolu, on peut y accéder sans risque.
      partnerId: partner?.id,
      partnerEmail: partner?.email,
    };
  }
}