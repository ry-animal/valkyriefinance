import { and, desc, eq, sql, sum } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { stakingMetrics, stakingPositions, stakingRewards } from '../db/schema/staking';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';

// Input validation schemas
const stakeInputSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  type: z.enum(['sVLK', 'veVLK']),
  lockDuration: z.number().optional(), // Required for veVLK
  transactionHash: z.string().min(1, 'Transaction hash is required'),
  blockNumber: z.number().min(1, 'Block number is required'),
  veVlkTokenId: z.string().optional(), // For veVLK positions
});

const claimRewardsInputSchema = z.object({
  transactionHash: z.string().min(1, 'Transaction hash is required'),
  blockNumber: z.number().min(1, 'Block number is required'),
  amountClaimed: z.string().min(1, 'Amount is required'),
  stakingType: z.enum(['sVLK', 'veVLK', 'combined']),
  rewardAsset: z.string().default('USDC'),
});

const withdrawInputSchema = z.object({
  positionId: z.string().min(1, 'Position ID is required'),
  transactionHash: z.string().min(1, 'Transaction hash is required'),
  blockNumber: z.number().min(1, 'Block number is required'),
});

export const stakingRouter = router({
  // Get user's staking positions
  getPositions: protectedProcedure
    .input(
      z.object({
        type: z.enum(['sVLK', 'veVLK', 'all']).optional().default('all'),
        includeInactive: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const whereConditions = [eq(stakingPositions.userId, userId)];

      if (input.type !== 'all') {
        whereConditions.push(eq(stakingPositions.type, input.type));
      }

      if (!input.includeInactive) {
        whereConditions.push(eq(stakingPositions.isActive, true));
      }

      const positions = await db
        .select()
        .from(stakingPositions)
        .where(and(...whereConditions))
        .orderBy(desc(stakingPositions.createdAt));

      return positions;
    }),

  // Get user's staking summary
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get active positions summary
    const positionsSummary = await db
      .select({
        type: stakingPositions.type,
        totalAmount: sum(stakingPositions.amount),
        totalVotingPower: sum(stakingPositions.votingPower),
        count: sql<number>`count(*)`,
      })
      .from(stakingPositions)
      .where(and(eq(stakingPositions.userId, userId), eq(stakingPositions.isActive, true)))
      .groupBy(stakingPositions.type);

    // Get total rewards claimed
    const totalRewards = await db
      .select({
        stakingType: stakingRewards.stakingType,
        totalClaimed: sum(stakingRewards.amountClaimed),
        rewardAsset: stakingRewards.rewardAsset,
      })
      .from(stakingRewards)
      .where(eq(stakingRewards.userId, userId))
      .groupBy(stakingRewards.stakingType, stakingRewards.rewardAsset);

    return {
      positions: positionsSummary,
      rewards: totalRewards,
    };
  }),

  // Create a new staking position
  createPosition: protectedProcedure.input(stakeInputSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;

    // Calculate voting power for veVLK positions
    let votingPower = '0';
    if (input.type === 'veVLK' && input.lockDuration) {
      // Simplified voting power calculation
      // In production, this would match the smart contract calculation
      const maxLockDays = 1460; // 4 years
      const lockDays = input.lockDuration / (24 * 60 * 60);
      votingPower = (parseFloat(input.amount) * (lockDays / maxLockDays)).toString();
    }

    const lockStartTime = input.type === 'veVLK' ? new Date() : null;
    const lockEndTime =
      input.type === 'veVLK' && input.lockDuration
        ? new Date(Date.now() + input.lockDuration * 1000)
        : null;

    const [position] = await db
      .insert(stakingPositions)
      .values({
        userId,
        type: input.type,
        amount: input.amount,
        lockDuration: input.lockDuration,
        lockStartTime,
        lockEndTime,
        veVlkTokenId: input.veVlkTokenId,
        votingPower,
        transactionHash: input.transactionHash,
        blockNumber: input.blockNumber,
      })
      .returning();

    return position;
  }),

  // Record reward claim
  claimRewards: protectedProcedure
    .input(claimRewardsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Get current staking balances for context
      const activePositions = await db
        .select()
        .from(stakingPositions)
        .where(and(eq(stakingPositions.userId, userId), eq(stakingPositions.isActive, true)));

      const totalStakingBalance = activePositions
        .reduce((sum, pos) => sum + parseFloat(pos.amount), 0)
        .toString();

      const totalVotingPower = activePositions
        .reduce((sum, pos) => sum + parseFloat(pos.votingPower || '0'), 0)
        .toString();

      // Get current reward epoch (simplified)
      const currentEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily epochs

      const [reward] = await db
        .insert(stakingRewards)
        .values({
          userId,
          rewardEpoch: currentEpoch,
          stakingType: input.stakingType,
          amountClaimed: input.amountClaimed,
          rewardAsset: input.rewardAsset,
          stakingBalance: totalStakingBalance,
          votingPowerAtClaim: totalVotingPower,
          transactionHash: input.transactionHash,
          blockNumber: input.blockNumber,
        })
        .returning();

      return reward;
    }),

  // Withdraw/unstake position
  withdrawPosition: protectedProcedure
    .input(withdrawInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify position ownership and update status
      const [updatedPosition] = await db
        .update(stakingPositions)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(and(eq(stakingPositions.id, input.positionId), eq(stakingPositions.userId, userId)))
        .returning();

      if (!updatedPosition) {
        throw new Error('Position not found or not owned by user');
      }

      return updatedPosition;
    }),

  // Get pending rewards calculation
  getPendingRewards: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get active positions
    const activePositions = await db
      .select()
      .from(stakingPositions)
      .where(and(eq(stakingPositions.userId, userId), eq(stakingPositions.isActive, true)));

    if (activePositions.length === 0) {
      return {
        sVlkRewards: '0',
        veVlkRewards: '0',
        totalRewards: '0',
      };
    }

    // Simplified reward calculation
    // In production, this would be more sophisticated
    const sVlkPositions = activePositions.filter((p) => p.type === 'sVLK');
    const veVlkPositions = activePositions.filter((p) => p.type === 'veVLK');

    const sVlkBalance = sVlkPositions.reduce((sum, pos) => sum + parseFloat(pos.amount), 0);

    const veVlkVotingPower = veVlkPositions.reduce(
      (sum, pos) => sum + parseFloat(pos.votingPower || '0'),
      0
    );

    // Base APY calculations (simplified)
    const sVlkApy = 0.01; // 1% APY for liquid staking
    const veVlkApy = 0.04; // 4% APY for locked staking

    const daysSinceLastClaim = 1; // Simplified - would check actual last claim
    const sVlkRewards = ((sVlkBalance * sVlkApy * daysSinceLastClaim) / 365).toString();
    const veVlkRewards = ((veVlkVotingPower * veVlkApy * daysSinceLastClaim) / 365).toString();
    const totalRewards = (parseFloat(sVlkRewards) + parseFloat(veVlkRewards)).toString();

    return {
      sVlkRewards,
      veVlkRewards,
      totalRewards,
    };
  }),

  // Get global staking metrics
  getGlobalMetrics: publicProcedure.query(async () => {
    // Get latest metrics snapshot
    const [latestMetrics] = await db
      .select()
      .from(stakingMetrics)
      .orderBy(desc(stakingMetrics.createdAt))
      .limit(1);

    if (!latestMetrics) {
      // Return default metrics if none exist
      return {
        totalVlkStaked: '0',
        totalSVlkSupply: '0',
        totalVeVlkSupply: '0',
        totalVotingPower: '0',
        sVlkApy: '1.0000',
        averageVeVlkApy: '4.0000',
        activeStakers: 0,
        activeVeVlkPositions: 0,
        averageLockDuration: 0,
      };
    }

    return latestMetrics;
  }),

  // Get reward history
  getRewardHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        stakingType: z.enum(['sVLK', 'veVLK', 'combined', 'all']).optional().default('all'),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const whereConditions = [eq(stakingRewards.userId, userId)];

      if (input.stakingType !== 'all') {
        whereConditions.push(eq(stakingRewards.stakingType, input.stakingType));
      }

      const rewards = await db
        .select()
        .from(stakingRewards)
        .where(and(...whereConditions))
        .orderBy(desc(stakingRewards.claimedAt))
        .limit(input.limit)
        .offset(input.offset);

      return rewards;
    }),

  // Update metrics (admin function - could be moved to admin router)
  updateMetrics: protectedProcedure
    .input(
      z.object({
        totalVlkStaked: z.string(),
        totalSVlkSupply: z.string(),
        totalVeVlkSupply: z.string(),
        totalVotingPower: z.string(),
        sVlkApy: z.string(),
        averageVeVlkApy: z.string(),
        activeStakers: z.number(),
        activeVeVlkPositions: z.number(),
        averageLockDuration: z.number(),
        blockNumber: z.number(),
        lastRewardEpoch: z.number(),
        totalRewardsDistributed: z.string(),
        rewardAsset: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [metrics] = await db
        .insert(stakingMetrics)
        .values({
          ...input,
          snapshotAt: new Date(),
        })
        .returning();

      return metrics;
    }),
});
