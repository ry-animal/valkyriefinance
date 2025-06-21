import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from 'drizzle-orm';
import { db } from '../index';

async function applyRLS() {
  console.log('🔒 Applying Row Level Security...');

  try {
    // Read the SQL file
    const sqlPath = join(__dirname, 'enable-rls.sql');
    const rlsSQL = readFileSync(sqlPath, 'utf-8');

    // Execute the SQL
    await db.execute(sql.raw(rlsSQL));

    console.log('✅ Row Level Security enabled successfully!');
    console.log('⚠️  Remember to remove the service role bypass policies in production!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to apply RLS:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  applyRLS();
}
