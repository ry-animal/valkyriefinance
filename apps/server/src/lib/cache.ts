// Simple in-memory cache for performance optimization
// In production, consider using Redis or similar

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlMs: number = 60000): void {
    // Default 1 minute TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
export const cache = new SimpleCache();

// Cache key generators for consistent naming
export const cacheKeys = {
  userPortfolios: (userId: string) => `user:${userId}:portfolios`,
  portfolioDetails: (portfolioId: string) => `portfolio:${portfolioId}:details`,
  portfolioAssets: (portfolioId: string) => `portfolio:${portfolioId}:assets`,
  marketData: (tokenAddress: string, chainId: number) => `market:${chainId}:${tokenAddress}`,
  userStats: (userId: string) => `user:${userId}:stats`,
};

// Cached query wrapper
export async function withCache<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlMs: number = 60000
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute query and cache result
  const result = await queryFn();
  cache.set(key, result, ttlMs);
  return result;
}

// Cache invalidation helpers
export const invalidateCache = {
  userPortfolios: (userId: string) => {
    cache.delete(cacheKeys.userPortfolios(userId));
    cache.delete(cacheKeys.userStats(userId));
  },
  portfolio: (portfolioId: string) => {
    cache.delete(cacheKeys.portfolioDetails(portfolioId));
    cache.delete(cacheKeys.portfolioAssets(portfolioId));
  },
  marketData: (tokenAddress: string, chainId: number) => {
    cache.delete(cacheKeys.marketData(tokenAddress, chainId));
  },
};

// Auto-cleanup every 5 minutes
setInterval(
  () => {
    cache.cleanup();
  },
  5 * 60 * 1000
);
