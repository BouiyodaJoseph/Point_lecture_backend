import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { NotificationsService } from './notifications.service';
import { GetUser } from '../../auth/decorators/user.decorator';
//import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface'; // <-- CORRECTION

@Controller('/api/v1/partner/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_PARTNER', 'ROLE_ADMIN') // Accessible aux deux
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getMyNotifications(@GetUser() user: JwtPayload) {
    return this.notificationsService.findUnreadForUser(user.sub);
  }

  @Post(':id/mark-as-read')
  markAsRead(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.notificationsService.markAsRead(id, user.sub);
  }
}