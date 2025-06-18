import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';

export const transactionTypeEnum = pgEnum('transaction_type', [
  'swap',
  'deposit',
  'withdrawal',
  'bridge',
  'approve',
  'liquidity_add',
  'liquidity_remove',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'confirmed',
  'failed',
  'cancelled',
]);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    hash: text('hash').notNull().unique(),
    type: transactionTypeEnum('type').notNull(),
    status: transactionStatusEnum('status').default('pending').notNull(),
    chainId: integer('chain_id').notNull(),
    blockNumber: integer('block_number'),
    gasUsed: numeric('gas_used', { precision: 20, scale: 0 }),
    gasPrice: numeric('gas_price', { precision: 20, scale: 0 }),
    value: numeric('value', { precision: 36, scale: 18 }),
    fromAddress: text('from_address').notNull(),
    toAddress: text('to_address'),
    tokenAddress: text('token_address'),
    tokenAmount: numeric('token_amount', { precision: 36, scale: 18 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userHashIdx: index('transactions_user_hash_idx').on(table.userId, table.hash),
    statusIdx: index('transactions_status_idx').on(table.status),
    typeIdx: index('transactions_type_idx').on(table.type),
    chainIdx: index('transactions_chain_idx').on(table.chainId),
  })
);
