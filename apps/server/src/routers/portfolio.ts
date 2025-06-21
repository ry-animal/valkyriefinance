import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, portfolioAssets, portfolios } from '@/db';
import {
  getPortfolioAssetsSummary,
  getPortfolioCount,
  getPortfolioDetails,
  getPortfolioSummary,
} from '@/db/queries/portfolio';
import { cacheKeys, invalidateCache, withCache } from '@/lib/cache';
import { publicProcedure, router } from '@/lib/trpc';

export const portfolioRouter = router({
  // Get user's portfolios (optimized with caching)
  getUserPortfolios: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await withCache(
        cacheKeys.userPortfolios(input.userId),
        () => getPortfolioSummary(input.userId),
        300000 // 5 minutes cache
      );
    }),

  // Get user's portfolio count (optimized count query with caching)
  getUserPortfolioCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await withCache(
        cacheKeys.userStats(input.userId),
        () => getPortfolioCount(input.userId),
        300000 // 5 minutes cache
      );
    }),

  // Get single portfolio details (cached)
  getPortfolioDetails: publicProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await withCache(
        cacheKeys.portfolioDetails(input.portfolioId),
        () => getPortfolioDetails(input.portfolioId, input.userId),
        180000 // 3 minutes cache
      );
      return result[0] || null;
    }),

  // Create a new portfolio (with cache invalidation)
  createPortfolio: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        isDefault: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const [portfolio] = await db.insert(portfolios).values(input).returning();

      // Invalidate user's portfolio cache
      invalidateCache.userPortfolios(input.userId);

      return portfolio;
    }),

  // Get portfolio assets (optimized with caching)
  getPortfolioAssets: publicProcedure
    .input(z.object({ portfolioId: z.string() }))
    .query(async ({ input }) => {
      return await withCache(
        cacheKeys.portfolioAssets(input.portfolioId),
        () => getPortfolioAssetsSummary(input.portfolioId),
        120000 // 2 minutes cache (shorter for more dynamic data)
      );
    }),

  // Add asset to portfolio (with cache invalidation)
  addAssetToPortfolio: publicProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        tokenAddress: z.string(),
        tokenSymbol: z.string(),
        tokenDecimals: z.number(),
        chainId: z.number(),
        balance: z.string(),
        valueUsd: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [asset] = await db.insert(portfolioAssets).values(input).returning();

      // Invalidate portfolio cache
      invalidateCache.portfolio(input.portfolioId);

      return asset;
    }),

  // Update portfolio total value (with cache invalidation)
  updatePortfolioValue: publicProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        totalValue: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [portfolio] = await db
        .update(portfolios)
        .set({
          totalValue: input.totalValue,
          updatedAt: new Date(),
        })
        .where(eq(portfolios.id, input.portfolioId))
        .returning();

      // Invalidate portfolio cache
      invalidateCache.portfolio(input.portfolioId);

      return portfolio;
    }),

  // Update portfolio assets (transactional)
  updatePortfolioAssets: publicProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        assets: z.array(
          z.object({
            tokenAddress: z.string(),
            tokenSymbol: z.string(),
            tokenDecimals: z.number(),
            chainId: z.number(),
            balance: z.string(),
            valueUsd: z.string().optional(),
          })
        ),
        totalValue: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Use a transaction to ensure data consistency
      return await db.transaction(async (tx) => {
        // 1. Delete existing assets
        await tx.delete(portfolioAssets).where(eq(portfolioAssets.portfolioId, input.portfolioId));

        // 2. Insert new assets
        const newAssets =
          input.assets.length > 0
            ? await tx
                .insert(portfolioAssets)
                .values(
                  input.assets.map((asset) => ({
                    portfolioId: input.portfolioId,
                    ...asset,
                  }))
                )
                .returning()
            : [];

        // 3. Update portfolio total value
        const [updatedPortfolio] = await tx
          .update(portfolios)
          .set({
            totalValue: input.totalValue,
            updatedAt: new Date(),
          })
          .where(eq(portfolios.id, input.portfolioId))
          .returning();

        return {
          portfolio: updatedPortfolio,
          assets: newAssets,
        };
      });
    }),
});
