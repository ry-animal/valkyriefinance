import { pgTable, text, numeric, integer, boolean, uuid, timestamp, index, pgEnum, jsonb } from 'drizzle-orm/pg-core'
import { user } from './user'

export const vaultOperationTypeEnum = pgEnum('vault_operation_type', [
  'deposit',
  'withdrawal',
  'rebalance',
  'harvest',
  'emergency_exit',
])

export const vaultOperations = pgTable('vault_operations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  vaultAddress: text('vault_address').notNull(),
  operationType: vaultOperationTypeEnum('operation_type').notNull(),
  assetAmount: numeric('asset_amount', { precision: 36, scale: 18 }).notNull(),
  shareAmount: numeric('share_amount', { precision: 36, scale: 18 }).notNull(),
  transactionHash: text('transaction_hash').notNull(),
  blockNumber: integer('block_number').notNull(),
  sharePrice: numeric('share_price', { precision: 36, scale: 18 }),
  gasUsed: numeric('gas_used', { precision: 20, scale: 0 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userVaultIdx: index('vault_operations_user_vault_idx')
    .on(table.userId, table.vaultAddress),
  operationTypeIdx: index('vault_operations_type_idx').on(table.operationType),
  blockNumberIdx: index('vault_operations_block_idx').on(table.blockNumber),
}))

export const vaultStrategies = pgTable('vault_strategies', {
  id: uuid('id').primaryKey().defaultRandom(),
  vaultAddress: text('vault_address').notNull(),
  strategyAddress: text('strategy_address').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  allocation: numeric('allocation', { precision: 5, scale: 4 }).notNull(),
  expectedApy: numeric('expected_apy', { precision: 5, scale: 4 }),
  actualApy: numeric('actual_apy', { precision: 5, scale: 4 }),
  totalAssets: numeric('total_assets', { precision: 36, scale: 18 }).default('0'),
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  vaultStrategyIdx: index('vault_strategies_vault_idx').on(table.vaultAddress),
  activeStrategiesIdx: index('vault_strategies_active_idx')
    .on(table.vaultAddress, table.isActive),
})) 