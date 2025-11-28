import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  // On doit déclarer que ce provider a besoin du ConfigService pour fonctionner.
  // NestJS s'assurera de l'injecter dans le `useFactory`.
  inject: [ConfigService],
  
  provide: REDIS_CLIENT,

  /**
   * Cette fonction "factory" est exécutée par NestJS pour créer le client Redis.
   * Elle reçoit le ConfigService en argument grâce à `inject` ci-dessus.
   */
  useFactory: (configService: ConfigService) => {
    // On essaie de récupérer l'URL complète (pour la production sur Vercel/Upstash)
    const redisUrl = configService.get<string>('REDIS_URL');
    
    // Si l'URL existe, on l'utilise en priorité.
    if (redisUrl) {
      console.log('Connexion à Redis via REDIS_URL (Production)...');
      const client = new Redis(redisUrl);
      
      client.on('error', e => {
        console.error(`Erreur de connexion Redis (Production): ${e}`);
        throw new Error(`Erreur de connexion Redis: ${e}`);
      });
      
      return client;
    }

    // Sinon (pour le développement local), on utilise les variables séparées.
    console.log('REDIS_URL non trouvée. Connexion à Redis en local...');
    const client = new Redis({
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
    });

    client.on('error', e => {
      console.error(`Erreur de connexion Redis (Local): ${e}`);
      throw new Error(`Erreur de connexion Redis: ${e}`);
    });

    return client;
  },
};