import {
    Inject,
    Injectable,
    NotFoundException,
    StreamableFile,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Redis } from 'ioredis';
  import { Repository } from 'typeorm';
  import * as fs from 'fs';
  import * as path from 'path';
  
  import { REDIS_CLIENT } from '../../redis/redis.provider';
  import { Establishment } from '../../establishments/entities/establishment.entity';
  import { PublicationsRepository } from '../../publications/publications.repository';
  // ASSUREZ-VOUS d'importer l'entité Publication
  import { Publication } from '../../publications/entities/publication.entity';
  
  @Injectable()
  export class ContentService {
    constructor(
      @Inject(REDIS_CLIENT) private readonly redis: Redis,
      @InjectRepository(Establishment)
      private readonly establishmentRepository: Repository<Establishment>,
      // Ce repository est nécessaire pour vérifier l'accès
      private readonly publicationsRepository: PublicationsRepository,
    ) {}
  
    /**
     * Valide la session et les droits d'accès, puis retourne le contenu de la publication.
     * @param sessionId L'ID de session de l'utilisateur.
     * @param publicationId L'ID de la publication demandée.
     * @returns Un StreamableFile contenant le PDF.
     */
    async getContent(sessionId: string, publicationId: string): Promise<StreamableFile> {
      // 1. Valider la session et obtenir l'ID de l'établissement
      const establishmentId = await this.validateSession(sessionId);
  
      // 2. Récupérer l'établissement et son partenaire
      const establishment = await this.establishmentRepository.findOne({
        where: { id: establishmentId },
        relations: { partner: true },
      });
  
      if (!establishment) {
        throw new UnauthorizedException('Établissement de session invalide.');
      }
      const partnerId = (await establishment.partner).id;
  
      // 3. Vérifier que le partenaire a bien accès à cette publication via un abonnement actif
      const activePublications = await this.publicationsRepository.findActivePublicationsForPartner(partnerId);
      const hasAccess = activePublications.some(pub => pub.id === publicationId);
      
      if (!hasAccess) {
        throw new UnauthorizedException('Accès non autorisé à cette publication.');
      }
  
      // 4. Si la validation réussit, construire le chemin du fichier et le servir
      // NOTE : Assurez-vous d'avoir un dossier 'static/publications/' à la racine de votre projet.
      const filePath = path.join(process.cwd(), 'static', 'publications', `${publicationId}.pdf`);
      
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Contenu de la publication non trouvé.');
      }
      
      const file = fs.createReadStream(filePath);
      return new StreamableFile(file);
    }
  
    /**
     * Méthode privée pour valider la session dans Redis.
     * @param sessionId L'ID de session.
     * @returns L'ID de l'établissement si la session est valide.
     */
    private async validateSession(sessionId: string): Promise<string> {
      const sessionKey = `user_session:${sessionId}`;
      const establishmentId = await this.redis.get(sessionKey);
      if (!establishmentId) {
        throw new UnauthorizedException('Session invalide ou expirée.');
      }
      return establishmentId;
    }
  }