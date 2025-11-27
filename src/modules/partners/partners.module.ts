import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';
import { MySpaceModule } from './my-space/my-space.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [DashboardModule, ProfileModule, MySpaceModule, NotificationsModule]
})
export class PartnersModule {}
