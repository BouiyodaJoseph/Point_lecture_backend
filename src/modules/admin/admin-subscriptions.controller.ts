import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// =======================================================
// ==                 NOUVEL IMPORT                     ==
// =======================================================
import { SubscriptionResponseDto } from './dto/subscription.response.dto';

@Controller('/api/v1/admin/subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_ADMIN')
export class AdminSubscriptionsController {
  constructor(
    private readonly adminSubscriptionsService: AdminSubscriptionsService,
  ) {}

  /**
   * Crée un nouvel abonnement.
   */
  @Post()
  // On spécifie le type de retour pour la clarté et la sécurité de typage
  create(@Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    return this.adminSubscriptionsService.create(dto);
  }

  /**
   * Récupère la liste de tous les abonnements.
   */
  @Get()
  findAll(): Promise<SubscriptionResponseDto[]> {
    return this.adminSubscriptionsService.findAll();
  }

  /**
   * Récupère un abonnement par son ID.
   */
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<SubscriptionResponseDto> {
    return this.adminSubscriptionsService.findOne(id);
  }

  /**
   * Révoque (supprime) un abonnement.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.adminSubscriptionsService.remove(id);
  }
}