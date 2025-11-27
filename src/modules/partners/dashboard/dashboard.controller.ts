import { Controller, Get, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/user.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';//import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { DashboardService } from './dashboard.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Repository } from 'typeorm';

@Controller('/api/v1/partner/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_PARTNER')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    // On injecte le repository pour trouver l'établissement associé au partenaire
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
  ) {}

  @Get()
  async getDashboard(
    @GetUser() user: JwtPayload,
    @Query('period') period = 'LAST_7_DAYS',
  ) {
    const partnerId = user.sub; // L'ID du partenaire est dans le subject du token

    // 1. Trouver l'établissement qui appartient à ce partenaire.
    // NOTE : Logique simple qui suppose qu'un partenaire n'a qu'un seul établissement.
    const establishment = await this.establishmentRepository.findOne({
      where: { partner: { id: partnerId } },
    });

    if (!establishment) {
      throw new NotFoundException(`Aucun établissement trouvé pour ce partenaire (ID: ${partnerId})`);
    }

    // 2. Appeler le service avec l'ID de l'établissement trouvé.
    return this.dashboardService.getDashboardData(establishment.id, period);
  }
}