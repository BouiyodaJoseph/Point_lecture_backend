import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Repository } from 'typeorm';
import { getDistance } from 'geolib';

@Injectable()
export class GeoValidationService {
  constructor(
    // On injecte le Repository pour pouvoir accéder à la table des établissements
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
  ) {}

  /**
   * Valide si des coordonnées GPS sont dans le périmètre d'un établissement.
   * @param establishmentId L'ID de l'établissement à vérifier.
   * @param userLatitude La latitude de l'utilisateur.
   * @param userLongitude La longitude de l'utilisateur.
   * @returns `true` si la position est valide, `false` sinon.
   */
  async isPositionValid(
    establishmentId: string,
    userLatitude: number,
    userLongitude: number,
  ): Promise<boolean> {
    // 1. Récupérer l'établissement depuis la base de données
    const establishment = await this.establishmentRepository.findOneBy({ id: establishmentId });

    // Si l'établissement n'existe pas, la position ne peut pas être valide.
    if (!establishment) {
      return false;
    }

    // 2. Calculer la distance en mètres entre le point de l'utilisateur et celui de l'établissement
    const distanceInMeters = getDistance(
      // Coordonnées de l'utilisateur
      { latitude: userLatitude, longitude: userLongitude },
      // Coordonnées de l'établissement
      { latitude: establishment.latitude, longitude: establishment.longitude },
    );

    // 3. Comparer la distance calculée avec le rayon autorisé de l'établissement
    return distanceInMeters <= establishment.geofenceRadius;
  }
}