import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';

// Module Redis manuel et global
import { RedisClientModule } from './modules/redis/redis.module';

// Tous les modules fonctionnels de l'application
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { DashboardModule } from './modules/partners/dashboard/dashboard.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { ProfileModule } from './modules/partners/profile/profile.module';
import { MySpaceModule } from './modules/partners/my-space/my-space.module';
import { PacksModule } from './modules/packs/packs.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { KioskModule } from './modules/public/kiosk/kiosk.module';
import { SessionModule } from './modules/public/session/session.module';
import { ReadingModule } from './modules/public/reading/reading.module';
import { NotificationsModule } from './modules/partners/notifications/notifications.module';

@Module({
  imports: [
    // --- MODULES DE CONFIGURATION DE BASE ---
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),

    // Configuration de la base de données unifiée (Prod/Dev)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Utilise une seule variable d'environnement pour l'URL de connexion
        url: configService.get<string>('DATABASE_URL'),
        // L'option SSL est requise pour Vercel/Neon et ne pose pas de problème en local
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: false, // Toujours à 'false' quand on utilise des migrations
      }),
    }),

    // Configuration globale de JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
      global: true,
    }),

    // Notre module Redis manuel et global
    RedisClientModule,

    // --- MODULES FONCTIONNELS DE L'APPLICATION (LISTE COMPLÈTE) ---
    AdminModule,
    AuthModule,
    UsersModule,
    SeederModule,
    DashboardModule,
    AnalyticsModule,
    PublicationsModule,
    ProfileModule,
    MySpaceModule,
    PacksModule,
    SubscriptionsModule,
    KioskModule,
    SessionModule,
    ReadingModule,
    NotificationsModule,
  ],
})
export class AppModule {}