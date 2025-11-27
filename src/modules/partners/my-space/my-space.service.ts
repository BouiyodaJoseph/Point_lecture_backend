import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Repository } from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity'; // Entité à créer

@Injectable()
export class MySpaceService {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  // Équivalent de findByPartner_Id
  findEstablishmentsByPartner(partnerId: string): Promise<Establishment[]> {
    return this.establishmentRepository.find({
      where: { partner: { id: partnerId } },
    });
  }

  // Équivalent de findByPartner_Id
  findSubscriptionsByPartner(partnerId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { partner: { id: partnerId } },
      relations: { pack: true }, // Pour pouvoir afficher le nom du pack
    });
  }
}