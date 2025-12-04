import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// On encapsule le bootstrap dans une variable que l'on va exporter.
// C'est ce que Vercel cherchera.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('FRONTEND_URL');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  // En environnement serverless, on initialise l'app sans l'écouter
  await app.init();
  
  // On retourne le serveur HTTP sous-jacent
  return app.getHttpAdapter().getInstance();
}

// On exporte la promesse de l'application bootstrappée
export default bootstrap();