import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    
    // Logique de connexion dynamique
    const redisUrl = configService.get<string>('REDIS_URL');
    
    let redisInstance: Redis;

    if (redisUrl) {
      // Connexion de production via URL
      redisInstance = new Redis(redisUrl);
    } else {
      // Connexion de développement via host/port
      redisInstance = new Redis({
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
      });
    }

    redisInstance.on('error', e => {
      console.error(`Erreur de connexion Redis: ${e}`);
    });

    return redisInstance;
  },
};