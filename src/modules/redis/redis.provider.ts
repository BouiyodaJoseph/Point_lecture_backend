import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  // On injecte ConfigService pour pouvoir lire les variables d'environnement
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    
    // =======================================================
    // ==         LOGIQUE DE CONNEXION DYNAMIQUE            ==
    // =======================================================
    // En production, Vercel/Upstash fournit une URL complète
    const redisUrl = configService.get<string>('REDIS_URL');
    
    let redisInstance: Redis;

    if (redisUrl) {
      // Si l'URL existe, on l'utilise pour la connexion de production
      redisInstance = new Redis(redisUrl);
    } else {
      // Sinon, on utilise la configuration locale pour le développement
      redisInstance = new Redis({
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
      });
    }
    // =======================================================

    redisInstance.on('error', e => {
      // En production, il est préférable de logger l'erreur sans faire planter l'application
      console.error(`Erreur de connexion Redis: ${e}`);
    });

    return redisInstance;
  },
};