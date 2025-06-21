import { z } from 'zod';
import { cache } from '@/lib/cache';
import { performanceMonitor } from '@/lib/performance';
import { publicProcedure, router } from '@/lib/trpc';

export const adminRouter = router({
  // Get performance statistics
  getPerformanceStats: publicProcedure.query(async () => {
    return performanceMonitor.getStats();
  }),

  // Get slow queries
  getSlowQueries: publicProcedure
    .input(
      z.object({
        thresholdMs: z.number().default(1000),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      return performanceMonitor.getSlowQueries(input.thresholdMs, input.limit);
    }),

  // Get cache statistics
  getCacheStats: publicProcedure.query(async () => {
    return cache.getStats();
  }),

  // Clear cache (for debugging)
  clearCache: publicProcedure.mutation(async () => {
    cache.clear();
    return { success: true, message: 'Cache cleared' };
  }),

  // Clear performance metrics (for debugging)
  clearMetrics: publicProcedure.mutation(async () => {
    performanceMonitor.clearMetrics();
    return { success: true, message: 'Performance metrics cleared' };
  }),

  // Health check with performance info
  healthCheck: publicProcedure.query(async () => {
    const stats = performanceMonitor.getStats();
    const cacheStats = cache.getStats();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      performance: {
        avgQueryTime: stats.last5Minutes?.avgDuration || 0,
        cacheHitRate: stats.last5Minutes?.cacheHitRate || 0,
        slowQueries: stats.last5Minutes?.slowQueries || 0,
      },
      cache: {
        size: cacheStats.size,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }),
});
