import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- AJOUTER CET IMPORT
import { AccessPointService } from './access-point.service';
import { KioskController } from './kiosk.controller';
import { QrCodeService } from './qrcode.service';
import { AuthModule } from '../../auth/auth.module';
import { Establishment } from '../../establishments/entities/establishment.entity'; // <-- AJOUTER CET IMPORT

@Module({
  imports: [
    AuthModule, // Pour ApiKeyAuthGuard
    // =======================================================
    // ==                 LA CORRECTION FINALE                ==
    // =======================================================
    // Cette ligne rend EstablishmentRepository injectable dans ce module
    TypeOrmModule.forFeature([Establishment]),
  ],
  controllers: [KioskController],
  providers: [AccessPointService, QrCodeService],
})
export class KioskModule {}