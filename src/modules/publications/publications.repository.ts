import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';

@Injectable()
export class PublicationsRepository extends Repository<Publication> {
  constructor(private dataSource: DataSource) {
    super(Publication, dataSource.createEntityManager());
  }

  /**
   * Trouve toutes les publications uniques auxquelles un partenaire a accès
   * via ses abonnements actifs.
   * @param partnerId L'ID du partenaire.
   * @returns Une promesse d'un tableau de Publications.
   */
  async findActivePublicationsForPartner(partnerId: string): Promise<Publication[]> {
    // 1. On utilise find() pour récupérer tous les abonnements du partenaire,
    //    en chargeant explicitement les relations 'pack' et 'pack.publications'.
    const subscriptions = await this.dataSource
      .getRepository(Subscription)
      .find({
        relations: {
          pack: {
            publications: true, // Charge les packs ET les publications de chaque pack
          },
        },
        where: {
          partner: {
            id: partnerId,
          },
        },
      });

    // 2. On filtre en mémoire pour ne garder que les abonnements actifs.
    const now = new Date();
    const activeSubscriptions = subscriptions.filter(
      s => s.endDate >= now && s.startDate <= now,
    );

    if (!activeSubscriptions.length) {
      return [];
    }
        
    // 3. On "aplatit" la structure pour obtenir une liste unique de publications.
    const allPublications = activeSubscriptions.flatMap(sub => sub.pack.publications);
    
    // 4. On déduplique la liste.
    const uniquePublications = [
      ...new Map(allPublications.filter(p => p).map(p => [p.id, p])).values(),
    ];

    return uniquePublications;
  }
}