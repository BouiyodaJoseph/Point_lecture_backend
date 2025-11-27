import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    // Cette configuration sera lue depuis le .env si vous utilisez ConfigService,
    // mais pour l'instant, nous la mettons en dur pour garantir que ça fonctionne.
    const redisInstance = new Redis({
      host: 'localhost',
      port: 6379,
    });

    redisInstance.on('error', e => {
      throw new Error(`Erreur de connexion Redis: ${e}`);
    });

    return redisInstance;
  },
};