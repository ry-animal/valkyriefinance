// Performance monitoring utilities

interface QueryMetrics {
  queryName: string;
  duration: number;
  timestamp: number;
  userId?: string;
  cached: boolean;
}

class PerformanceMonitor {
  private metrics: QueryMetrics[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 metrics

  logQuery(queryName: string, duration: number, userId?: string, cached = false) {
    const metric: QueryMetrics = {
      queryName,
      duration,
      timestamp: Date.now(),
      userId,
      cached,
    };

    this.metrics.push(metric);

    // Keep only the last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`🐌 Slow query detected: ${queryName} took ${duration}ms`);
    }
  }

  getStats() {
    const now = Date.now();
    const last5Minutes = this.metrics.filter((m) => now - m.timestamp < 5 * 60 * 1000);
    const last1Hour = this.metrics.filter((m) => now - m.timestamp < 60 * 60 * 1000);

    const calculateStats = (metrics: QueryMetrics[]) => {
      if (metrics.length === 0) return null;

      const durations = metrics.map((m) => m.duration);
      const cached = metrics.filter((m) => m.cached).length;

      return {
        count: metrics.length,
        avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        cacheHitRate: (cached / metrics.length) * 100,
        slowQueries: metrics.filter((m) => m.duration > 1000).length,
      };
    };

    return {
      last5Minutes: calculateStats(last5Minutes),
      lastHour: calculateStats(last1Hour),
      total: calculateStats(this.metrics),
    };
  }

  getSlowQueries(thresholdMs = 1000, limit = 10) {
    return this.metrics
      .filter((m) => m.duration > thresholdMs)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
      .map((m) => ({
        queryName: m.queryName,
        duration: m.duration,
        timestamp: new Date(m.timestamp).toISOString(),
        userId: m.userId,
      }));
  }

  clearMetrics() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Query timing decorator
export function withTiming<T extends any[], R>(queryName: string, fn: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      performanceMonitor.logQuery(queryName, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.logQuery(`${queryName}_ERROR`, duration);
      throw error;
    }
  };
}

// Cached query timing decorator
export function withCachedTiming<T extends any[], R>(
  queryName: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      // Assume it's cached if it's very fast (< 10ms)
      const cached = duration < 10;
      performanceMonitor.logQuery(queryName, duration, undefined, cached);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.logQuery(`${queryName}_ERROR`, duration);
      throw error;
    }
  };
}

// Performance middleware for tRPC
export const performanceMiddleware = (queryName: string) => {
  return async (opts: any) => {
    const start = performance.now();
    try {
      const result = await opts.next();
      const duration = performance.now() - start;

      // Extract userId from context if available
      const userId = opts.ctx?.user?.id;
      performanceMonitor.logQuery(queryName, duration, userId);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.logQuery(`${queryName}_ERROR`, duration);
      throw error;
    }
  };
};
