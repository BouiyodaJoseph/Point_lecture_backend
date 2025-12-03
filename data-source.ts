import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Import de TOUTES vos entités une par une
import { User } from './src/modules/users/entities/user.entity';
import { Establishment } from './src/modules/establishments/entities/establishment.entity';
import { Category } from './src/modules/publications/entities/category.entity';
import { Publisher } from './src/modules/publications/entities/publisher.entity';
import { Publication } from './src/modules/publications/entities/publication.entity';
import { PublicationPack } from './src/modules/packs/entities/publication-pack.entity';
import { Subscription } from './src/modules/subscriptions/entities/subscription.entity';
import { AnalyticsEvent } from './src/modules/analytics/entities/analytics-event.entity';
import { Notification } from './src/modules/partners/notifications/entities/notification.entity';

config(); // Charge le fichier .env par défaut

// On définit une configuration de base
const baseOptions: DataSourceOptions = {
  type: 'postgres',
  // On liste explicitement toutes les entités
  entities: [
    User,
    Establishment,
    Category,
    Publisher,
    Publication,
    PublicationPack,
    Subscription,
    AnalyticsEvent,
    Notification,
  ],
  migrations: ['src/migrations/*.ts'],
};

// On choisit la configuration en fonction de la présence de DATABASE_URL
const options: DataSourceOptions = process.env.DATABASE_URL
  ? // Configuration de Production (utilise DATABASE_URL)
    {
      ...baseOptions,
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Requis pour Vercel/Neon
    }
  : // Configuration de Développement (utilise les variables séparées)
    {
      ...baseOptions,
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    };

export default new DataSource(options);