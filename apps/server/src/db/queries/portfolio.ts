import { and, desc, eq, sql } from 'drizzle-orm';
import { db, portfolioAssets, portfolios } from '../index';

// Optimized portfolio queries - select only needed columns to reduce data transfer

export const getPortfolioSummary = async (userId: string) => {
  return await db
    .select({
      id: portfolios.id,
      name: portfolios.name,
      totalValue: portfolios.totalValue,
      currency: portfolios.currency,
      isDefault: portfolios.isDefault,
      updatedAt: portfolios.updatedAt,
    })
    .from(portfolios)
    .where(eq(portfolios.userId, userId))
    .orderBy(desc(portfolios.isDefault), desc(portfolios.updatedAt));
};

export const getPortfolioDetails = async (portfolioId: string, userId: string) => {
  return await db
    .select({
      id: portfolios.id,
      name: portfolios.name,
      description: portfolios.description,
      totalValue: portfolios.totalValue,
      currency: portfolios.currency,
      isDefault: portfolios.isDefault,
      createdAt: portfolios.createdAt,
      updatedAt: portfolios.updatedAt,
    })
    .from(portfolios)
    .where(and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId)))
    .limit(1);
};

export const getPortfolioAssetsSummary = async (portfolioId: string) => {
  return await db
    .select({
      id: portfolioAssets.id,
      tokenAddress: portfolioAssets.tokenAddress,
      tokenSymbol: portfolioAssets.tokenSymbol,
      balance: portfolioAssets.balance,
      valueUsd: portfolioAssets.valueUsd,
      lastUpdated: portfolioAssets.lastUpdated,
    })
    .from(portfolioAssets)
    .where(eq(portfolioAssets.portfolioId, portfolioId))
    .orderBy(desc(portfolioAssets.valueUsd));
};

export const getPortfolioAssetsDetailed = async (portfolioId: string) => {
  return await db
    .select()
    .from(portfolioAssets)
    .where(eq(portfolioAssets.portfolioId, portfolioId))
    .orderBy(desc(portfolioAssets.valueUsd));
};

// Optimized count queries
export const getPortfolioCount = async (userId: string) => {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(portfolios)
    .where(eq(portfolios.userId, userId));

  return result[0]?.count ?? 0;
};

export const getPortfolioAssetCount = async (portfolioId: string) => {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(portfolioAssets)
    .where(eq(portfolioAssets.portfolioId, portfolioId));

  return result[0]?.count ?? 0;
};

// Optimized portfolio queries for better performance
