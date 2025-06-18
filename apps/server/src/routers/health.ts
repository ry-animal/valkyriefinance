import { sql } from 'drizzle-orm';
import { db } from '../db';
import { env } from '../lib/env';
import { publicProcedure, router } from '../lib/trpc';

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const start = Date.now();
    const checks: Record<string, { status: 'up' | 'down'; latency?: number; error?: string }> = {};

    try {
      // Database connectivity check
      const dbStart = Date.now();
      await db.execute(sql`SELECT 1`);
      checks.database = {
        status: 'up',
        latency: Date.now() - dbStart,
      };
    } catch (error) {
      checks.database = {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown database error',
      };
    }

    try {
      // AI service check (basic connectivity)
      if (env.GOOGLE_AI_API_KEY) {
        checks.ai = { status: 'up' };
      } else {
        checks.ai = { status: 'down', error: 'AI API key not configured' };
      }
    } catch (error) {
      checks.ai = {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown AI service error',
      };
    }

    // Overall health status
    const allHealthy = Object.values(checks).every((check) => check.status === 'up');

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      responseTime: Date.now() - start,
    };
  }),

  ping: publicProcedure.query(() => {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }),
});
