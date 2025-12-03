import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';

// Import de tous vos modules
import { RedisClientModule } from './modules/redis/redis.module';
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

    // =======================================================
    // ==     CONFIGURATION DE BDD DYNAMIQUE (PROD/DEV)     ==
    // =======================================================
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // En production, Vercel fournit POSTGRES_URL. S'il existe, on l'utilise.
        const productionUrl = configService.get<string>('POSTGRES_URL');
        
        if (productionUrl) {
          // Configuration pour la production (Vercel)
          return {
            type: 'postgres',
            url: productionUrl,
            ssl: { rejectUnauthorized: false }, // Requis pour Vercel/Neon
            autoLoadEntities: true,
            synchronize: false,
          };
        } else {
          // Sinon, on utilise la configuration locale du fichier .env
          return {
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USER'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            autoLoadEntities: true,
            synchronize: false,
          };
        }
      },
    }),
    // =======================================================

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

    // Liste complète des modules fonctionnels
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