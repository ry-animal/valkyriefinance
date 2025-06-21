import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '@/lib/env';
import * as analytics from './schema/analytics';
import * as portfolio from './schema/portfolio';
import * as transactions from './schema/transactions';
import * as user from './schema/user';
import * as vault from './schema/vault';

// Connection pool configuration for better performance
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Connection pool settings
  max: 20, // Maximum number of connections
  min: 2, // Minimum number of connections
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 10000, // 10 seconds
  maxUses: 7500, // Reuse connections up to 7500 times
  // Performance optimizations
  statement_timeout: 30000, // 30 second query timeout
  idle_in_transaction_session_timeout: 30000, // 30 second idle transaction timeout
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

export const db = drizzle(pool, {
  schema: {
    ...user,
    ...portfolio,
    ...transactions,
    ...vault,
    ...analytics,
  },
  logger: process.env.NODE_ENV === 'development',
});

export * from './schema/analytics';
export * from './schema/portfolio';
export * from './schema/transactions';
export * from './schema/user';
export * from './schema/vault';
