import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, vaultOperations, vaultStrategies } from '@/db';
import { publicProcedure, router } from '@/lib/trpc';

export const vaultRouter = router({
  // Get user's vault operations
  getUserVaultOperations: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        vaultAddress: z.string().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const conditions = [eq(vaultOperations.userId, input.userId)];

      if (input.vaultAddress) {
        conditions.push(eq(vaultOperations.vaultAddress, input.vaultAddress));
      }

      return await db
        .select()
        .from(vaultOperations)
        .where(and(...conditions))
        .orderBy(desc(vaultOperations.createdAt))
        .limit(input.limit);
    }),

  // Record vault operation
  recordVaultOperation: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        vaultAddress: z.string(),
        operationType: z.enum(['deposit', 'withdrawal', 'rebalance', 'harvest', 'emergency_exit']),
        assetAmount: z.string(),
        shareAmount: z.string(),
        transactionHash: z.string(),
        blockNumber: z.number(),
        sharePrice: z.string().optional(),
        gasUsed: z.string().optional(),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [operation] = await db.insert(vaultOperations).values(input).returning();
      return operation;
    }),

  // Get vault strategies
  getVaultStrategies: publicProcedure
    .input(
      z.object({
        vaultAddress: z.string(),
        activeOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      const conditions = [eq(vaultStrategies.vaultAddress, input.vaultAddress)];

      if (input.activeOnly) {
        conditions.push(eq(vaultStrategies.isActive, true));
      }

      return await db
        .select()
        .from(vaultStrategies)
        .where(and(...conditions));
    }),

  // Create or update vault strategy
  upsertVaultStrategy: publicProcedure
    .input(
      z.object({
        vaultAddress: z.string(),
        strategyAddress: z.string(),
        name: z.string(),
        description: z.string().optional(),
        allocation: z.string(),
        expectedApy: z.string().optional(),
        actualApy: z.string().optional(),
        totalAssets: z.string().default('0'),
        isActive: z.boolean().default(true),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [strategy] = await db
        .insert(vaultStrategies)
        .values(input)
        .onConflictDoUpdate({
          target: [vaultStrategies.vaultAddress, vaultStrategies.strategyAddress],
          set: {
            name: input.name,
            description: input.description,
            allocation: input.allocation,
            expectedApy: input.expectedApy,
            actualApy: input.actualApy,
            totalAssets: input.totalAssets,
            isActive: input.isActive,
            metadata: input.metadata,
            updatedAt: new Date(),
          },
        })
        .returning();
      return strategy;
    }),

  // Update strategy performance
  updateStrategyPerformance: publicProcedure
    .input(
      z.object({
        strategyId: z.string(),
        actualApy: z.string(),
        totalAssets: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [strategy] = await db
        .update(vaultStrategies)
        .set({
          actualApy: input.actualApy,
          totalAssets: input.totalAssets,
          updatedAt: new Date(),
        })
        .where(eq(vaultStrategies.id, input.strategyId))
        .returning();
      return strategy;
    }),

  // Rebalance vault strategies (transactional)
  rebalanceVaultStrategies: publicProcedure
    .input(
      z.object({
        vaultAddress: z.string(),
        strategies: z.array(
          z.object({
            strategyAddress: z.string(),
            name: z.string(),
            allocation: z.string(), // Percentage as decimal (e.g., "0.25" for 25%)
            isActive: z.boolean(),
          })
        ),
        operationDetails: z.object({
          userId: z.string(),
          transactionHash: z.string(),
          blockNumber: z.number(),
          gasUsed: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // Ensure allocations sum to 1 (100%)
      const totalAllocation = input.strategies.reduce(
        (sum, s) => sum + parseFloat(s.allocation),
        0
      );

      if (Math.abs(totalAllocation - 1) > 0.0001) {
        throw new Error(`Allocations must sum to 100% (got ${totalAllocation * 100}%)`);
      }

      // Use a transaction for atomic updates
      return await db.transaction(async (tx) => {
        // 1. Update all strategies
        const updatedStrategies = await Promise.all(
          input.strategies.map(async (strategy) => {
            const [updated] = await tx
              .insert(vaultStrategies)
              .values({
                vaultAddress: input.vaultAddress,
                strategyAddress: strategy.strategyAddress,
                name: strategy.name,
                allocation: strategy.allocation,
                isActive: strategy.isActive,
              })
              .onConflictDoUpdate({
                target: [vaultStrategies.vaultAddress, vaultStrategies.strategyAddress],
                set: {
                  allocation: strategy.allocation,
                  isActive: strategy.isActive,
                  updatedAt: new Date(),
                },
              })
              .returning();
            return updated;
          })
        );

        // 2. Record the rebalance operation
        const [operation] = await tx
          .insert(vaultOperations)
          .values({
            userId: input.operationDetails.userId,
            vaultAddress: input.vaultAddress,
            operationType: 'rebalance',
            assetAmount: '0', // Rebalance doesn't move assets, just changes allocations
            shareAmount: '0',
            transactionHash: input.operationDetails.transactionHash,
            blockNumber: input.operationDetails.blockNumber,
            gasUsed: input.operationDetails.gasUsed,
            metadata: {
              strategies: input.strategies,
              previousAllocations: await tx
                .select({
                  strategyAddress: vaultStrategies.strategyAddress,
                  allocation: vaultStrategies.allocation,
                })
                .from(vaultStrategies)
                .where(eq(vaultStrategies.vaultAddress, input.vaultAddress)),
            },
          })
          .returning();

        return {
          strategies: updatedStrategies,
          operation,
        };
      });
    }),
});
