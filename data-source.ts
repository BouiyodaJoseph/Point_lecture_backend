import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Import de TOUTES vos entités une par une pour garantir la découverte
import { User } from './src/modules/users/entities/user.entity';
import { Establishment } from './src/modules/establishments/entities/establishment.entity';
import { Category } from './src/modules/publications/entities/category.entity';
import { Publisher } from './src/modules/publications/entities/publisher.entity';
import { Publication } from './src/modules/publications/entities/publication.entity';
import { PublicationPack } from './src/modules/packs/entities/publication-pack.entity';
import { Subscription } from './src/modules/subscriptions/entities/subscription.entity';
import { AnalyticsEvent } from './src/modules/analytics/entities/analytics-event.entity';
import { Notification } from './src/modules/partners/notifications/entities/notification.entity';

config(); // Charge les variables du fichier .env

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  
  /**
   * On liste explicitement toutes les entités.
   * C'est la méthode la plus robuste pour s'assurer que le CLI de TypeORM
   * les prend toutes en compte lors de la génération des migrations.
   */
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
  
  // Le CLI cherchera les migrations dans ce dossier
  migrations: ['src/migrations/*.ts'],
});