import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { env } from '../lib/env';
import { db } from './index';

async function main() {
  console.log('Running migrations...');

  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}
