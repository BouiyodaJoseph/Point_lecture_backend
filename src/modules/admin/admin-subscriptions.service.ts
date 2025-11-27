import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { addDays } from 'date-fns';

import { Subscription } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { PublicationPack } from '../packs/entities/publication-pack.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// =======================================================
// ==                 NOUVEL IMPORT                     ==
// =======================================================
import { SubscriptionResponseDto } from './dto/subscription.response.dto';

@Injectable()
export class AdminSubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PublicationPack)
    private readonly packRepository: Repository<PublicationPack>,
  ) {}

  /**
   * Méthode de mapping privée pour transformer une entité en DTO.
   */
  private async mapToDto(subscription: Subscription): Promise<SubscriptionResponseDto> {
    const partner = await subscription.partner; // Résoudre la relation
    const pack = await subscription.pack;       // Résoudre la relation
    return {
      id: subscription.id,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      partnerId: partner.id,
      packId: pack.id,
    };
  }

  /**
   * Crée un nouvel abonnement pour un partenaire.
   */
  async create(dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const [partner, pack] = await Promise.all([
      this.userRepository.findOneBy({ id: dto.partnerId }),
      this.packRepository.findOneBy({ id: dto.packId }),
    ]);

    if (!partner) {
      throw new BadRequestException(`Partenaire avec l'ID ${dto.partnerId} non trouvé.`);
    }
    if (!pack) {
      throw new BadRequestException(`Pack avec l'ID ${dto.packId} non trouvé.`);
    }

    const newSubscription = this.subscriptionRepository.create({
      partner,
      pack,
      startDate: new Date(),
      endDate: addDays(new Date(), dto.durationInDays),
    });

    const savedSubscription = await this.subscriptionRepository.save(newSubscription);

    // On mappe vers le DTO avant de retourner
    return this.mapToDto(savedSubscription);
  }

  /**
   * Trouve tous les abonnements.
   */
  async findAll(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.find({
      relations: {
        partner: true,
        pack: true,
      },
    });
    // On mappe chaque élément de la liste
    return Promise.all(subscriptions.map(s => this.mapToDto(s)));
  }

  /**
   * Trouve un abonnement par son ID.
   */
  async findOne(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: {
        partner: true,
        pack: true,
      },
    });
    if (!subscription) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} non trouvé.`);
    }
    return this.mapToDto(subscription);
  }

  /**
   * Révoque (supprime) un abonnement.
   */
  async remove(id: string): Promise<void> {
    const result = await this.subscriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} non trouvé.`);
    }
  }
}