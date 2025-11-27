import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// =======================================================
// ==              CORRECTION DE L'URL DE BASE          ==
// =======================================================
@Controller('/api/v1/admin/users') // Correction de 'v-1' en 'v1'
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_ADMIN')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.adminUsersService.create(createUserDto);
  }

  // =======================================================
  // ==             NOUVEL ENDPOINT OPTIMISÉ              ==
  // =======================================================
  /**
   * Retourne uniquement la liste des utilisateurs ayant le rôle 'ROLE_PARTNER'.
   * Doit être placé AVANT la route dynamique '/:id'.
   */
  @Get('partners')
  findAllPartners() {
    return this.adminUsersService.findAllPartners();
  }

  /**
   * Retourne la liste de TOUS les utilisateurs.
   */
  @Get()
  findAll() {
    return this.adminUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminUsersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminUsersService.remove(id);
  }
}