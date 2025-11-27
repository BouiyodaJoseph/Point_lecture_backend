import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminPublicationsService } from './admin-publications.service';

@Controller('/api/v1/admin/publications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_ADMIN')
export class AdminPublicationsController {
  constructor(private readonly adminPublicationsService: AdminPublicationsService) {}

  @Get()
  findAll() {
    return this.adminPublicationsService.findAll();
  }
}