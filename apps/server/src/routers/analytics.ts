import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc";
import { db, aiRecommendations, marketData } from "@/db";
import { eq, and, desc, gte } from "drizzle-orm";

export const analyticsRouter = router({
  // Get AI recommendations for user
  getAIRecommendations: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      type: z.string().optional(),
      unexecutedOnly: z.boolean().default(false),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const conditions = [eq(aiRecommendations.userId, input.userId)];
      
      if (input.type) {
        conditions.push(eq(aiRecommendations.type, input.type));
      }
      
      if (input.unexecutedOnly) {
        conditions.push(eq(aiRecommendations.isExecuted, false));
      }
      
      return await db
        .select()
        .from(aiRecommendations)
        .where(and(...conditions))
        .orderBy(desc(aiRecommendations.confidence), desc(aiRecommendations.createdAt))
        .limit(input.limit);
    }),

  // Create AI recommendation
  createAIRecommendation: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      type: z.string(),
      title: z.string(),
      description: z.string(),
      confidence: z.string().optional(),
      expectedReturn: z.string().optional(),
      riskLevel: z.number().optional(),
      recommendation: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const [recommendation] = await db
        .insert(aiRecommendations)
        .values({
          ...input,
          recommendation: input.recommendation || {},
        })
        .returning();
      return recommendation;
    }),

  // Execute AI recommendation
  executeAIRecommendation: publicProcedure
    .input(z.object({
      recommendationId: z.string(),
      executionResult: z.any(),
    }))
    .mutation(async ({ input }) => {
      const [recommendation] = await db
        .update(aiRecommendations)
        .set({
          isExecuted: true,
          executedAt: new Date(),
          executionResult: input.executionResult,
          updatedAt: new Date(),
        })
        .where(eq(aiRecommendations.id, input.recommendationId))
        .returning();
      return recommendation;
    }),

  // Get market data
  getMarketData: publicProcedure
    .input(z.object({
      tokenAddress: z.string().optional(),
      chainId: z.number().optional(),
      symbol: z.string().optional(),
      limit: z.number().default(100),
    }))
    .query(async ({ input }) => {
      const conditions = [];
      
      if (input.tokenAddress) {
        conditions.push(eq(marketData.tokenAddress, input.tokenAddress));
      }
      
      if (input.chainId) {
        conditions.push(eq(marketData.chainId, input.chainId));
      }
      
      if (input.symbol) {
        conditions.push(eq(marketData.symbol, input.symbol));
      }
      
      const query = db
        .select()
        .from(marketData)
        .orderBy(desc(marketData.createdAt))
        .limit(input.limit);
      
      if (conditions.length > 0) {
        query.where(and(...conditions));
      }
      
      return await query;
    }),

  // Update market data
  updateMarketData: publicProcedure
    .input(z.object({
      tokenAddress: z.string(),
      chainId: z.number(),
      symbol: z.string(),
      priceUsd: z.string(),
      marketCap: z.string().optional(),
      volume24h: z.string().optional(),
      priceChange24h: z.string().optional(),
      liquidityUsd: z.string().optional(),
      source: z.string(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const [data] = await db
        .insert(marketData)
        .values(input)
        .returning();
      return data;
    }),

  // Get latest price for token
  getLatestPrice: publicProcedure
    .input(z.object({
      tokenAddress: z.string(),
      chainId: z.number(),
    }))
    .query(async ({ input }) => {
      const [latest] = await db
        .select()
        .from(marketData)
        .where(and(
          eq(marketData.tokenAddress, input.tokenAddress),
          eq(marketData.chainId, input.chainId)
        ))
        .orderBy(desc(marketData.createdAt))
        .limit(1);
      
      return latest || null;
    }),
}); 