import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';

// Module Redis manuel et global
import { RedisClientModule } from './modules/redis/redis.module';

// Tous les autres modules fonctionnels
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
// =======================================================
// ==                 DERNIER IMPORT                    ==
// =======================================================
import { NotificationsModule } from './modules/partners/notifications/notifications.module';

@Module({
  imports: [
    // --- MODULES DE CONFIGURATION DE BASE ---
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USER', 'postgres'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME', 'ekiosque_partners'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
      global: true,
    }),

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
    NotificationsModule, // <-- DERNIER MODULE AJOUTÉ
  ],
})
export class AppModule {}