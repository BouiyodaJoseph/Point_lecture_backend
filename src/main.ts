import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// On encapsule le bootstrap dans une variable `handler` que l'on va exporter.
// C'est ce que Vercel cherchera.
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuration CORS dynamique
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Pipe de validation global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // On initialise l'application sans la démarrer
  await app.init();
  // On retourne le gestionnaire de requêtes (Express)
  return app.getHttpAdapter().getInstance();
};

// On exporte la variable pour que Vercel puisse l'importer.
export default bootstrap();