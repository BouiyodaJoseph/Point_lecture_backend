import {
    Controller,
    Get,
    Header,
    Param,
    ParseUUIDPipe,
    Query,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { Public } from '../../auth/decorators/public.decorator';
  import { ContentService } from './content.service';
  import { SessionIdDto } from './dto/session-id.dto';
  
  @Controller('/api/v1/public/publications')
  @Public()
  export class ContentController {
    constructor(private readonly contentService: ContentService) {}
  
    /**
     * Sert le contenu d'une publication (ex: un fichier PDF).
     * @param publicationId L'ID de la publication demandée.
     * @param query Le DTO contenant l'ID de session validé.
     */
    @Get(':publicationId/content')
    @Header('Content-Type', 'application/pdf') // Indique au navigateur que la réponse est un PDF
    @UsePipes(new ValidationPipe({ transform: true }))
    async getPublicationContent(
      @Param('publicationId', new ParseUUIDPipe()) publicationId: string,
      @Query() query: SessionIdDto,
    ) {
      return this.contentService.getContent(query.session_id, publicationId);
    }
  }