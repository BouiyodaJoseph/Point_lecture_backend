import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // Configuration CORS dynamique
  app.enableCors({
    origin: frontendUrl || 'http://localhost:3001', // Fallback pour le dev local
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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

  // =======================================================
  // ==                LA CORRECTION FINALE               ==
  // =======================================================
  // En production sur Vercel (ou autre), écouter sur le port fourni par l'environnement.
  // En local, écouter sur le port 3000.
  // L'hôte '0.0.0.0' permet au serveur d'être accessible de l'extérieur du conteneur.
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  // =======================================================
}

bootstrap();