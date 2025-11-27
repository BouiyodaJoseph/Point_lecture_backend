import {
    Controller,
    Get,
    Query,
    UnauthorizedException,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { Public } from '../../auth/decorators/public.decorator';
  import { ReadingService } from './reading.service';
  import { SessionIdDto } from './dto/session-id.dto'; // DTO de validation simple
  
  @Controller('/api/v1/public/reading-page')
  @Public()
  export class ReadingController {
    constructor(private readonly readingService: ReadingService) {}
  
    /**
     * Retourne les données nécessaires pour afficher la page de lecture
     * (nom de l'établissement, liste des publications autorisées).
     * @param query Le DTO contenant l'ID de session validé.
     */
    @Get()
    @UsePipes(new ValidationPipe({ transform: true })) // Valide les DTOs dans les Query Params
    async getReadingPage(@Query() query: SessionIdDto) {
      return this.readingService.getReadingPageData(query.session_id);
    }
  }