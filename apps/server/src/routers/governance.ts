import { and, count, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { governanceProposals, governanceVotes } from '../db/schema/staking';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';

// Input validation schemas
const createProposalInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  targets: z.array(z.string()).min(1, 'At least one target required'),
  values: z.array(z.string()),
  calldatas: z.array(z.string()),
  startBlock: z.number().min(1),
  endBlock: z.number().min(1),
  creationTransactionHash: z.string().min(1),
  aiStrategyType: z
    .enum(['risk_tolerance', 'asset_whitelist', 'chain_priority', 'general'])
    .optional(),
  strategyParameters: z.string().optional(), // JSON string
});

const voteInputSchema = z.object({
  proposalId: z.string().min(1),
  support: z.enum(['for', 'against', 'abstain']),
  votingPower: z.string().min(1),
  reason: z.string().optional(),
  veVlkTokenIds: z.array(z.string()).optional(),
  transactionHash: z.string().min(1),
  blockNumber: z.number().min(1),
});

const updateProposalStatusSchema = z.object({
  proposalId: z.string().min(1),
  status: z.enum(['pending', 'active', 'succeeded', 'defeated', 'queued', 'executed', 'canceled']),
  votesFor: z.string().optional(),
  votesAgainst: z.string().optional(),
  votesAbstain: z.string().optional(),
  queuedBlock: z.number().optional(),
  executedBlock: z.number().optional(),
});

export const governanceRouter = router({
  // Get all proposals with pagination and filtering
  getProposals: publicProcedure
    .input(
      z.object({
        status: z
          .enum([
            'all',
            'pending',
            'active',
            'succeeded',
            'defeated',
            'queued',
            'executed',
            'canceled',
          ])
          .optional()
          .default('all'),
        aiStrategyType: z
          .enum(['all', 'risk_tolerance', 'asset_whitelist', 'chain_priority', 'general'])
          .optional()
          .default('all'),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const whereConditions = [];

      if (input.status !== 'all') {
        whereConditions.push(eq(governanceProposals.status, input.status));
      }

      if (input.aiStrategyType !== 'all') {
        whereConditions.push(eq(governanceProposals.aiStrategyType, input.aiStrategyType));
      }

      const proposals = await db
        .select({
          id: governanceProposals.id,
          title: governanceProposals.title,
          description: governanceProposals.description,
          status: governanceProposals.status,
          votesFor: governanceProposals.votesFor,
          votesAgainst: governanceProposals.votesAgainst,
          votesAbstain: governanceProposals.votesAbstain,
          startBlock: governanceProposals.startBlock,
          endBlock: governanceProposals.endBlock,
          aiStrategyType: governanceProposals.aiStrategyType,
          createdAt: governanceProposals.createdAt,
          voteCount: count(governanceVotes.id),
        })
        .from(governanceProposals)
        .leftJoin(governanceVotes, eq(governanceProposals.id, governanceVotes.proposalId))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .groupBy(
          governanceProposals.id,
          governanceProposals.title,
          governanceProposals.description,
          governanceProposals.status,
          governanceProposals.votesFor,
          governanceProposals.votesAgainst,
          governanceProposals.votesAbstain,
          governanceProposals.startBlock,
          governanceProposals.endBlock,
          governanceProposals.aiStrategyType,
          governanceProposals.createdAt
        )
        .orderBy(desc(governanceProposals.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return proposals;
    }),

  // Get detailed proposal information
  getProposal: publicProcedure
    .input(
      z.object({
        proposalId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const [proposal] = await db
        .select()
        .from(governanceProposals)
        .where(eq(governanceProposals.id, input.proposalId))
        .limit(1);

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      // Get vote breakdown
      const votes = await db
        .select({
          support: governanceVotes.support,
          votingPower: governanceVotes.votingPower,
          voter: governanceVotes.voterId,
          reason: governanceVotes.reason,
          votedAt: governanceVotes.votedAt,
        })
        .from(governanceVotes)
        .where(eq(governanceVotes.proposalId, input.proposalId))
        .orderBy(desc(governanceVotes.votedAt));

      return {
        ...proposal,
        votes,
      };
    }),

  // Create a new proposal (synced from on-chain)
  createProposal: protectedProcedure
    .input(createProposalInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [proposal] = await db
        .insert(governanceProposals)
        .values({
          id: input.creationTransactionHash, // Use tx hash as ID for simplicity
          proposerId: userId,
          title: input.title,
          description: input.description,
          targets: input.targets,
          values: input.values,
          calldatas: input.calldatas,
          status: 'pending',
          startBlock: input.startBlock,
          endBlock: input.endBlock,
          creationTransactionHash: input.creationTransactionHash,
          aiStrategyType: input.aiStrategyType,
          strategyParameters: input.strategyParameters,
        })
        .returning();

      return proposal;
    }),

  // Cast a vote on a proposal
  castVote: protectedProcedure.input(voteInputSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;

    // Check if user has already voted
    const existingVote = await db
      .select()
      .from(governanceVotes)
      .where(
        and(eq(governanceVotes.proposalId, input.proposalId), eq(governanceVotes.voterId, userId))
      )
      .limit(1);

    if (existingVote.length > 0) {
      throw new Error('User has already voted on this proposal');
    }

    // Verify proposal exists and is active
    const [proposal] = await db
      .select()
      .from(governanceProposals)
      .where(eq(governanceProposals.id, input.proposalId))
      .limit(1);

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'active') {
      throw new Error('Proposal is not active for voting');
    }

    const [vote] = await db
      .insert(governanceVotes)
      .values({
        proposalId: input.proposalId,
        voterId: userId,
        support: input.support,
        votingPower: input.votingPower,
        reason: input.reason,
        veVlkTokenIds: input.veVlkTokenIds,
        transactionHash: input.transactionHash,
        blockNumber: input.blockNumber,
      })
      .returning();

    // Update proposal vote counts (this would be done by indexer in production)
    const currentVotesFor = parseFloat(proposal.votesFor || '0');
    const currentVotesAgainst = parseFloat(proposal.votesAgainst || '0');
    const currentVotesAbstain = parseFloat(proposal.votesAbstain || '0');
    const votePower = parseFloat(input.votingPower);

    let newVotesFor = currentVotesFor;
    let newVotesAgainst = currentVotesAgainst;
    let newVotesAbstain = currentVotesAbstain;

    switch (input.support) {
      case 'for':
        newVotesFor += votePower;
        break;
      case 'against':
        newVotesAgainst += votePower;
        break;
      case 'abstain':
        newVotesAbstain += votePower;
        break;
    }

    await db
      .update(governanceProposals)
      .set({
        votesFor: newVotesFor.toString(),
        votesAgainst: newVotesAgainst.toString(),
        votesAbstain: newVotesAbstain.toString(),
        updatedAt: new Date(),
      })
      .where(eq(governanceProposals.id, input.proposalId));

    return vote;
  }),

  // Update proposal status (admin/indexer function)
  updateProposalStatus: protectedProcedure
    .input(updateProposalStatusSchema)
    .mutation(async ({ input }) => {
      const updateData: any = {
        status: input.status,
        updatedAt: new Date(),
      };

      if (input.votesFor) updateData.votesFor = input.votesFor;
      if (input.votesAgainst) updateData.votesAgainst = input.votesAgainst;
      if (input.votesAbstain) updateData.votesAbstain = input.votesAbstain;
      if (input.queuedBlock) updateData.queuedBlock = input.queuedBlock;
      if (input.executedBlock) updateData.executedBlock = input.executedBlock;

      const [proposal] = await db
        .update(governanceProposals)
        .set(updateData)
        .where(eq(governanceProposals.id, input.proposalId))
        .returning();

      return proposal;
    }),

  // Get user's voting history
  getUserVotes: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const votes = await db
        .select({
          vote: governanceVotes,
          proposal: {
            id: governanceProposals.id,
            title: governanceProposals.title,
            status: governanceProposals.status,
            aiStrategyType: governanceProposals.aiStrategyType,
          },
        })
        .from(governanceVotes)
        .innerJoin(governanceProposals, eq(governanceVotes.proposalId, governanceProposals.id))
        .where(eq(governanceVotes.voterId, userId))
        .orderBy(desc(governanceVotes.votedAt))
        .limit(input.limit)
        .offset(input.offset);

      return votes;
    }),

  // Get user's voting power at current block
  getVotingPower: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // This would query the user's veVLK positions to calculate current voting power
    // For now, return a placeholder
    return {
      currentVotingPower: '0',
      veVlkPositions: [],
    };
  }),

  // Get proposal statistics
  getProposalStats: publicProcedure.query(async () => {
    const stats = await db
      .select({
        status: governanceProposals.status,
        count: count(governanceProposals.id),
      })
      .from(governanceProposals)
      .groupBy(governanceProposals.status);

    const aiStrategyStats = await db
      .select({
        aiStrategyType: governanceProposals.aiStrategyType,
        count: count(governanceProposals.id),
      })
      .from(governanceProposals)
      .where(sql`${governanceProposals.aiStrategyType} IS NOT NULL`)
      .groupBy(governanceProposals.aiStrategyType);

    return {
      byStatus: stats,
      byAiStrategy: aiStrategyStats,
    };
  }),
});
