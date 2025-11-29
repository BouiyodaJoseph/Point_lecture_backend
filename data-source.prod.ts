import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Charge les variables depuis un fichier .env.prod spécifique
config({ path: '.env.prod' }); 

// Vérification pour s'assurer que la variable est bien chargée
if (!process.env.DATABASE_URL) {
  throw new Error('La variable d\'environnement DATABASE_URL est manquante dans .env.prod');
}

export default new DataSource({
  type: 'postgres',
  // On utilise l'URL complète fournie par Vercel/Neon
  url: process.env.DATABASE_URL,
  // Le SSL est obligatoire pour se connecter aux bases de données Vercel/Neon
  ssl: {
    rejectUnauthorized: false,
  },
  // Le CLI doit lire les fichiers JS compilés, car c'est ce qui sera en production
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});