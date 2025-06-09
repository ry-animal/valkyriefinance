import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc";
import { db, vaultOperations, vaultStrategies } from "@/db";
import { eq, and, desc } from "drizzle-orm";

export const vaultRouter = router({
  // Get user's vault operations
  getUserVaultOperations: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      vaultAddress: z.string().optional(),
      limit: z.number().default(20),
    }))
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
    .input(z.object({
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
    }))
    .mutation(async ({ input }) => {
      const [operation] = await db
        .insert(vaultOperations)
        .values(input)
        .returning();
      return operation;
    }),

  // Get vault strategies
  getVaultStrategies: publicProcedure
    .input(z.object({ 
      vaultAddress: z.string(),
      activeOnly: z.boolean().default(true),
    }))
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
    .input(z.object({
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
    }))
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
    .input(z.object({
      strategyId: z.string(),
      actualApy: z.string(),
      totalAssets: z.string(),
    }))
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
}); 