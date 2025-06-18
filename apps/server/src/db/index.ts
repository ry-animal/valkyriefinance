import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '@/lib/env';
import * as analytics from './schema/analytics';
import * as portfolio from './schema/portfolio';
import * as transactions from './schema/transactions';
import * as user from './schema/user';
import * as vault from './schema/vault';

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    ...user,
    ...portfolio,
    ...transactions,
    ...vault,
    ...analytics,
  },
});

export * from './schema/analytics';
export * from './schema/portfolio';
export * from './schema/transactions';
export * from './schema/user';
export * from './schema/vault';
