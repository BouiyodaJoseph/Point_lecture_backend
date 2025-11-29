import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

// Importez votre configuration de source de données de production
import AppDataSourceProd from './data-source.prod';

async function runMigrations() {
  console.log('Initialisation de la source de données pour la migration...');
  
  // Le .env.prod a déjà été chargé par data-source.prod.ts
  const dataSource = AppDataSourceProd;

  try {
    await dataSource.initialize();
    console.log('Source de données initialisée avec succès.');

    console.log('Exécution des migrations en attente...');
    // Exécute les migrations
    const executedMigrations = await dataSource.runMigrations();

    if (executedMigrations.length === 0) {
      console.log('Aucune nouvelle migration à exécuter.');
    } else {
      console.log('Migrations exécutées avec succès:');
      executedMigrations.forEach(migration => console.log(` - ${migration.name}`));
    }

    await dataSource.destroy();
    console.log('Connexion à la base de données fermée.');
    process.exit(0);
  } catch (error) {
    console.error('ERREUR LORS DE LA MIGRATION :', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

runMigrations();