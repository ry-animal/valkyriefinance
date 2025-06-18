import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';

export const aiRecommendations = pgTable(
  'ai_recommendations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id),
    type: text('type').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    confidence: numeric('confidence', { precision: 3, scale: 2 }),
    expectedReturn: numeric('expected_return', { precision: 5, scale: 4 }),
    riskLevel: integer('risk_level'),
    recommendation: jsonb('recommendation').notNull(),
    isExecuted: boolean('is_executed').default(false),
    executedAt: timestamp('executed_at'),
    executionResult: jsonb('execution_result'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userTypeIdx: index('ai_recommendations_user_type_idx').on(table.userId, table.type),
    confidenceIdx: index('ai_recommendations_confidence_idx').on(table.confidence),
    executionIdx: index('ai_recommendations_execution_idx').on(table.isExecuted),
  })
);

export const marketData = pgTable(
  'market_data',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tokenAddress: text('token_address').notNull(),
    chainId: integer('chain_id').notNull(),
    symbol: text('symbol').notNull(),
    priceUsd: numeric('price_usd', { precision: 18, scale: 8 }).notNull(),
    marketCap: numeric('market_cap', { precision: 20, scale: 2 }),
    volume24h: numeric('volume_24h', { precision: 20, scale: 2 }),
    priceChange24h: numeric('price_change_24h', { precision: 5, scale: 4 }),
    liquidityUsd: numeric('liquidity_usd', { precision: 20, scale: 2 }),
    source: text('source').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    tokenChainIdx: index('market_data_token_chain_idx').on(table.tokenAddress, table.chainId),
    priceIdx: index('market_data_price_idx').on(table.priceUsd),
    timestampIdx: index('market_data_timestamp_idx').on(table.createdAt),
  })
);
