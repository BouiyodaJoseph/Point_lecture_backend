import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Charge les variables depuis .env.prod
config({ path: '.env.prod' }); 

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});