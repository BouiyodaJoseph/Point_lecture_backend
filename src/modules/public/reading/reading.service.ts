import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Repository } from 'typeorm';
import { PublicationsRepository } from '../../publications/publications.repository';
import { ReadingPageDto } from './dto/reading-page.dto';
import { PublicationSummaryDto } from './dto/publication-summary.dto';

@Injectable()
export class ReadingService {
  private readonly logger = new Logger(ReadingService.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly publicationsRepository: PublicationsRepository,
  ) {}

  async getReadingPageData(sessionId: string): Promise<ReadingPageDto> {
    this.logger.log(`--- DÉBUT DU FLUX getReadingPageData ---`);
    this.logger.log(`1. Validation de la session ID: ${sessionId}`);
    const establishmentId = await this.validateSession(sessionId);
    this.logger.log(`2. Session validée. ID d'établissement trouvé dans Redis: ${establishmentId}`);

    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: { partner: true },
    });

    if (!establishment) {
      this.logger.error(`ERREUR : L'établissement ${establishmentId} trouvé dans Redis n'existe pas dans la BDD.`);
      throw new UnauthorizedException('Établissement de session invalide.');
    }
    this.logger.log(`3. Établissement trouvé dans la BDD: ${establishment.name}`);

    const partner = await establishment.partner;
    if (!partner) {
        this.logger.error(`ERREUR : L'établissement ${establishment.name} n'a pas de partenaire associé.`);
        throw new UnauthorizedException('Partenaire de session invalide.');
    }
    const partnerId = partner.id;
    this.logger.log(`4. ID du partenaire extrait: ${partnerId}`);
    
    this.logger.log(`5. Appel de publicationsRepository.findActivePublicationsForPartner avec l'ID partenaire...`);
    const publications = await this.publicationsRepository.findActivePublicationsForPartner(partnerId);
    this.logger.log(`6. Le repository a retourné ${publications.length} publication(s).`);

    const publicationSummaries: PublicationSummaryDto[] = publications.map(pub => ({
        id: pub.id,
        title: pub.title,
        coverImageUrl: pub.coverImageUrl,
    }));

    this.logger.log(`--- FIN DU FLUX ---`);
    return {
        establishmentName: establishment.name,
        publications: publicationSummaries,
    };
  }
  
  private async validateSession(sessionId: string): Promise<string> {
    const sessionKey = `user_session:${sessionId}`;
    const establishmentId = await this.redis.get(sessionKey);
    if (!establishmentId) {
      this.logger.warn(`Session ID non trouvée dans Redis pour la clé: ${sessionKey}`);
      throw new UnauthorizedException('Session invalide ou expirée.');
    }
    return establishmentId;
  }
}