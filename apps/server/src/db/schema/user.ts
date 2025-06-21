import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: text('wallet_address').notNull().unique(),
  ensName: text('ens_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  portfolios: many(portfolios),
  transactions: many(transactions),
  vaultOperations: many(vaultOperations),
  aiRecommendations: many(aiRecommendations),
}));

import { aiRecommendations } from './analytics';
// Forward imports to avoid circular dependencies
import { portfolios } from './portfolio';
import { transactions } from './transactions';
import { vaultOperations } from './vault';
