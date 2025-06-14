import { pgTable, text, numeric, integer, boolean, uuid, timestamp, index } from 'drizzle-orm/pg-core'
import { user } from './user'

export const portfolios = pgTable('portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  description: text('description'),
  totalValue: numeric('total_value', { precision: 36, scale: 18 }).default('0'),
  currency: text('currency').default('USD').notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('portfolios_user_id_idx').on(table.userId),
  defaultPortfolioIdx: index('portfolios_default_idx').on(table.userId, table.isDefault),
}))

export const portfolioAssets = pgTable('portfolio_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  portfolioId: uuid('portfolio_id')
    .references(() => portfolios.id, { onDelete: 'cascade' })
    .notNull(),
  tokenAddress: text('token_address').notNull(),
  tokenSymbol: text('token_symbol').notNull(),
  tokenDecimals: integer('token_decimals').notNull(),
  chainId: integer('chain_id').notNull(),
  balance: numeric('balance', { precision: 36, scale: 18 }).notNull(),
  valueUsd: numeric('value_usd', { precision: 18, scale: 2 }),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  portfolioTokenIdx: index('portfolio_assets_portfolio_token_idx')
    .on(table.portfolioId, table.tokenAddress, table.chainId),
})) 