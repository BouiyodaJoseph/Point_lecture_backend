import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Note : On retire le logger Pino pour l'instant, car la configuration
// sur Vercel peut être complexe. Vercel a son propre système de logs.

async function bootstrap() {
  // On ne buffer plus les logs, car Pino est retiré pour le moment
  const app = await NestFactory.create(AppModule);

  // On récupère le ConfigService pour lire les variables d'environnement
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // =======================================================
  // ==        CONFIGURATION CORS DYNAMIQUE POUR PROD     ==
  // =======================================================
  app.enableCors({
    // En production, on n'autorise QUE l'URL officielle du frontend
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // =======================================================

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // =======================================================
  // ==     MODIFICATION CRUCIALE POUR VERCEL / SERVERLESS  ==
  // =======================================================
  // On n'appelle PAS app.listen() dans un environnement serverless.
  // Vercel se charge de démarrer le serveur.
  // Si vous avez besoin de lancer en local, vous pouvez utiliser un script différent.
  
  // Pour le développement local, on garde app.listen()
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(3000, '0.0.0.0');
  }
  
  return app;
}

// On exporte l'instance de l'application pour que Vercel puisse l'utiliser
export default bootstrap();