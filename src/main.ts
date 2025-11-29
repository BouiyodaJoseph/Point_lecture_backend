import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// On exporte l'application pour que Vercel puisse l'importer en tant que serverless function
// On encapsule le bootstrap dans une fonction qu'on peut appeler et exporter
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuration CORS dynamique pour la production et le développement local
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  app.enableCors({
    origin: frontendUrl || ['http://localhost:3001', 'http://192.168.182.199:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  return app; // On retourne l'instance de l'app
}

// =======================================================
// ==      DÉMARRAGE CONDITIONNEL (LOCAL vs VERCEL)       ==
// =======================================================

// Cette condition vérifie si le script est exécuté directement (local)
// ou importé (Vercel).
if (require.main === module) {
  async function startLocal() {
    const app = await bootstrap();
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
  startLocal();
}

// On exporte l'instance de l'app bootstrappée pour Vercel
export default bootstrap();