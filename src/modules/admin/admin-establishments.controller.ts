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
import { AdminEstablishmentsService } from './admin-establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('/api/v1/admin/establishments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_ADMIN')
export class AdminEstablishmentsController {
  constructor(
    private readonly adminEstablishmentsService: AdminEstablishmentsService,
  ) {}

  @Post()
  // Le ValidationPipe global s'applique automatiquement
  create(@Body() createDto: CreateEstablishmentDto) {
    return this.adminEstablishmentsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.adminEstablishmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminEstablishmentsService.findOne(id);
  }

  @Put(':id')
  // Le ValidationPipe global s'applique automatiquement
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateEstablishmentDto,
  ) {
    return this.adminEstablishmentsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminEstablishmentsService.remove(id);
  }
}