import { Module } from '@nestjs/common';
import { KioskModule } from './kiosk/kiosk.module';
import { SessionModule } from './session/session.module';
import { ReadingModule } from './reading/reading.module';

@Module({
  imports: [KioskModule, SessionModule, ReadingModule]
})
export class PublicModule {}
