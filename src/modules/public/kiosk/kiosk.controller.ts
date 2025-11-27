import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../../auth/guards/api-key.guard';
import { GetUser } from '../../auth/decorators/user.decorator';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { AccessPointService } from './access-point.service';

@Controller('/api/v1/public/kiosk')
export class KioskController {
  constructor(private readonly accessPointService: AccessPointService) {}

  @Post('refresh-access-point')
  @UseGuards(ApiKeyAuthGuard)
  refreshAccessPoint(@GetUser() establishment: Establishment) {
    return this.accessPointService.generateNewAccessPoint(establishment);
  }
}