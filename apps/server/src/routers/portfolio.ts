import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, portfolioAssets, portfolios } from '@/db';
import { publicProcedure, router } from '@/lib/trpc';

export const portfolioRouter = router({
  // Get user's portfolios
  getUserPortfolios: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await db.select().from(portfolios).where(eq(portfolios.userId, input.userId));
    }),

  // Create a new portfolio
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
      return portfolio;
    }),

  // Get portfolio assets
  getPortfolioAssets: publicProcedure
    .input(z.object({ portfolioId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(portfolioAssets)
        .where(eq(portfolioAssets.portfolioId, input.portfolioId));
    }),

  // Add asset to portfolio
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
      return asset;
    }),

  // Update portfolio total value
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
