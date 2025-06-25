import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user';

// Staking positions table - tracks both liquid (sVLK) and locked (veVLK) positions
export const stakingPositions = pgTable(
  'staking_positions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    // Position details
    type: text('type').notNull(), // 'sVLK' | 'veVLK'
    amount: decimal('amount', { precision: 78, scale: 18 }).notNull(), // Amount of VLK staked/locked

    // For veVLK positions
    lockDuration: integer('lock_duration'), // Duration in seconds
    lockStartTime: timestamp('lock_start_time'),
    lockEndTime: timestamp('lock_end_time'),
    veVlkTokenId: text('ve_vlk_token_id'), // NFT token ID for veVLK positions
    votingPower: decimal('voting_power', { precision: 78, scale: 18 }), // Current voting power

    // Transaction details
    transactionHash: text('transaction_hash').notNull(),
    blockNumber: integer('block_number').notNull(),

    // Status
    isActive: boolean('is_active').default(true).notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('staking_positions_user_id_idx').on(table.userId),
    typeIdx: index('staking_positions_type_idx').on(table.type),
    transactionHashIdx: index('staking_positions_tx_hash_idx').on(table.transactionHash),
    veVlkTokenIdIdx: index('staking_positions_ve_vlk_token_id_idx').on(table.veVlkTokenId),
  })
);

// Staking rewards table - tracks reward claims and distributions
export const stakingRewards = pgTable(
  'staking_rewards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    // Reward details
    rewardEpoch: integer('reward_epoch').notNull(),
    stakingType: text('staking_type').notNull(), // 'sVLK' | 'veVLK' | 'combined'
    amountClaimed: decimal('amount_claimed', { precision: 78, scale: 18 }).notNull(),
    rewardAsset: text('reward_asset').notNull().default('USDC'), // 'USDC' | 'ETH' | 'VLK'

    // Position context
    positionId: text('position_id').references(() => stakingPositions.id),
    stakingBalance: decimal('staking_balance', { precision: 78, scale: 18 }), // Balance at time of claim
    votingPowerAtClaim: decimal('voting_power_at_claim', { precision: 78, scale: 18 }),

    // Transaction details
    transactionHash: text('transaction_hash').notNull(),
    blockNumber: integer('block_number').notNull(),

    // Timestamps
    claimedAt: timestamp('claimed_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('staking_rewards_user_id_idx').on(table.userId),
    rewardEpochIdx: index('staking_rewards_epoch_idx').on(table.rewardEpoch),
    stakingTypeIdx: index('staking_rewards_staking_type_idx').on(table.stakingType),
    transactionHashIdx: index('staking_rewards_tx_hash_idx').on(table.transactionHash),
  })
);

// Governance proposals table - caches on-chain proposal data
export const governanceProposals = pgTable(
  'governance_proposals',
  {
    id: text('id').primaryKey(), // On-chain proposal ID
    proposerId: text('proposer_id').references(() => user.id),

    // Proposal content
    title: text('title').notNull(),
    description: text('description').notNull(),
    targets: text('targets').array(), // JSON array of target addresses
    values: text('values').array(), // JSON array of values
    calldatas: text('calldatas').array(), // JSON array of calldata

    // Proposal state
    status: text('status').notNull(), // 'pending' | 'active' | 'succeeded' | 'defeated' | 'queued' | 'executed' | 'canceled'
    votesFor: decimal('votes_for', { precision: 78, scale: 18 }).default('0').notNull(),
    votesAgainst: decimal('votes_against', { precision: 78, scale: 18 }).default('0').notNull(),
    votesAbstain: decimal('votes_abstain', { precision: 78, scale: 18 }).default('0').notNull(),

    // Block numbers for timing
    startBlock: integer('start_block').notNull(),
    endBlock: integer('end_block').notNull(),
    queuedBlock: integer('queued_block'),
    executedBlock: integer('executed_block'),

    // Transaction details
    creationTransactionHash: text('creation_transaction_hash').notNull(),

    // AI strategy specific fields
    aiStrategyType: text('ai_strategy_type'), // 'risk_tolerance' | 'asset_whitelist' | 'chain_priority' | etc.
    strategyParameters: text('strategy_parameters'), // JSON blob of strategy params

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('governance_proposals_status_idx').on(table.status),
    proposerIdIdx: index('governance_proposals_proposer_id_idx').on(table.proposerId),
    aiStrategyTypeIdx: index('governance_proposals_ai_strategy_type_idx').on(table.aiStrategyType),
  })
);

// Governance votes table - tracks individual votes on proposals
export const governanceVotes = pgTable(
  'governance_votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    proposalId: text('proposal_id')
      .notNull()
      .references(() => governanceProposals.id, { onDelete: 'cascade' }),
    voterId: text('voter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    // Vote details
    support: text('support').notNull(), // 'for' | 'against' | 'abstain'
    votingPower: decimal('voting_power', { precision: 78, scale: 18 }).notNull(),
    reason: text('reason'), // Optional voting reason/comment

    // veVLK positions used for voting
    veVlkTokenIds: text('ve_vlk_token_ids').array(), // Array of NFT token IDs used for voting

    // Transaction details
    transactionHash: text('transaction_hash').notNull(),
    blockNumber: integer('block_number').notNull(),

    // Timestamps
    votedAt: timestamp('voted_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    proposalVoterPk: primaryKey({ columns: [table.proposalId, table.voterId] }),
    proposalIdIdx: index('governance_votes_proposal_id_idx').on(table.proposalId),
    voterIdIdx: index('governance_votes_voter_id_idx').on(table.voterId),
    supportIdx: index('governance_votes_support_idx').on(table.support),
    transactionHashIdx: index('governance_votes_tx_hash_idx').on(table.transactionHash),
  })
);

// Staking metrics table - tracks global staking statistics
export const stakingMetrics = pgTable(
  'staking_metrics',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Global metrics
    totalVlkStaked: decimal('total_vlk_staked', { precision: 78, scale: 18 }).notNull(),
    totalSVlkSupply: decimal('total_s_vlk_supply', { precision: 78, scale: 18 }).notNull(),
    totalVeVlkSupply: decimal('total_ve_vlk_supply', { precision: 78, scale: 18 }).notNull(),
    totalVotingPower: decimal('total_voting_power', { precision: 78, scale: 18 }).notNull(),

    // APY calculations
    sVlkApy: decimal('s_vlk_apy', { precision: 10, scale: 4 }), // APY for liquid staking
    averageVeVlkApy: decimal('average_ve_vlk_apy', { precision: 10, scale: 4 }), // Average APY for locked staking

    // Reward distribution
    lastRewardEpoch: integer('last_reward_epoch').notNull(),
    totalRewardsDistributed: decimal('total_rewards_distributed', {
      precision: 78,
      scale: 18,
    }).notNull(),
    rewardAsset: text('reward_asset').notNull(),

    // Protocol metrics
    averageLockDuration: integer('average_lock_duration'), // In seconds
    activeStakers: integer('active_stakers').notNull(),
    activeVeVlkPositions: integer('active_ve_vlk_positions').notNull(),

    // Block and timestamp
    blockNumber: integer('block_number').notNull(),
    snapshotAt: timestamp('snapshot_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    blockNumberIdx: index('staking_metrics_block_number_idx').on(table.blockNumber),
    snapshotAtIdx: index('staking_metrics_snapshot_at_idx').on(table.snapshotAt),
  })
);

// Relations
export const stakingPositionsRelations = relations(stakingPositions, ({ one, many }) => ({
  user: one(user, {
    fields: [stakingPositions.userId],
    references: [user.id],
  }),
  rewards: many(stakingRewards),
}));

export const stakingRewardsRelations = relations(stakingRewards, ({ one }) => ({
  user: one(user, {
    fields: [stakingRewards.userId],
    references: [user.id],
  }),
  position: one(stakingPositions, {
    fields: [stakingRewards.positionId],
    references: [stakingPositions.id],
  }),
}));

export const governanceProposalsRelations = relations(governanceProposals, ({ one, many }) => ({
  proposer: one(user, {
    fields: [governanceProposals.proposerId],
    references: [user.id],
  }),
  votes: many(governanceVotes),
}));

export const governanceVotesRelations = relations(governanceVotes, ({ one }) => ({
  proposal: one(governanceProposals, {
    fields: [governanceVotes.proposalId],
    references: [governanceProposals.id],
  }),
  voter: one(user, {
    fields: [governanceVotes.voterId],
    references: [user.id],
  }),
}));
