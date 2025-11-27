import {
    Body,
    Controller,
    Post,
    UseGuards,
    ValidationPipe,
    Get,
    Param,
    ParseUUIDPipe,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { AdminPacksService } from './admin-packs.service';
  import { PackUpdateDto } from './dto/pack-update.dto';
  
  @Controller('/api/v1/admin/publication-packs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  export class AdminPacksController {
    constructor(private readonly adminPacksService: AdminPacksService) {}
  
    /**
     * Crée un nouveau pack de publications.
     */
    @Post()
    create(
      @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
      dto: PackUpdateDto,
    ) {
      return this.adminPacksService.create(dto);
    }
  
    /**
     * Récupère la liste de tous les packs.
     */
    @Get()
    findAll() {
      return this.adminPacksService.findAll();
    }
  
    /**
     * Récupère un pack par son ID.
     */
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.adminPacksService.findOne(id);
    }
  
    /**
     * Met à jour un pack existant.
     */
    @Put(':id')
    update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
      dto: PackUpdateDto,
    ) {
      return this.adminPacksService.update(id, dto);
    }
  
    /**
     * Supprime un pack.
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.adminPacksService.remove(id);
    }
  }