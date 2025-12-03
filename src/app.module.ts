import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';

// Import de tous les modules de l'application
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

    // --- CONFIGURATION DE LA BASE DE DONNÉES (DYNAMIQUE) ---
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        
        if (isProduction) {
          // Utilise les variables séparées fournies par Vercel en production
          return {
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: 5432, // Le port est standard pour Postgres
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DATABASE'),
            ssl: { rejectUnauthorized: false }, // Requis pour Vercel/Neon
            autoLoadEntities: true,
            synchronize: false, // Jamais 'true' en production
          };
        } else {
          // Utilise les variables du fichier .env pour le développement local
          return {
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST', 'localhost'),
            port: configService.get<number>('DATABASE_PORT', 5432),
            username: configService.get<string>('DATABASE_USER', 'postgres'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME', 'ekiosque_partners'),
            autoLoadEntities: true,
            synchronize: false, // On utilise les migrations
          };
        }
      },
    }),

    // --- CONFIGURATION GLOBALE DE JWT ---
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
      global: true,
    }),

    // --- MODULE REDIS ---
    RedisClientModule,

    // --- TOUS LES MODULES FONCTIONNELS ---
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