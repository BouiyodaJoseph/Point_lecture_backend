import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('X-API-Key');

    if (!apiKey) {
      throw new UnauthorizedException('En-tête X-API-Key manquant');
    }

    const establishment = await this.establishmentRepository.findOneBy({ apiKey });

    if (!establishment) {
      throw new UnauthorizedException('Clé API invalide');
    }

    // C'est la ligne la plus importante : on attache l'établissement à la requête.
    // Notre décorateur @GetUser() pourra maintenant le récupérer.
    (request as any).user = establishment;

    return true;
  }
}