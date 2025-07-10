import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { checkRedisHealth } from '@/lib/redis';

export const runtime = 'edge';

export async function GET() {
  const start = Date.now();

  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);
    const dbLatency = Date.now() - start;

    // Check Redis connection if available
    const redisHealth = await checkRedisHealth();

    // Check AI service connection
    let aiStatus = 'not_checked';
    let aiLatency = 0;

    if (process.env.AI_SERVICE_URL) {
      const aiStart = Date.now();
      try {
        const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 0 }, // No caching
        });

        aiStatus = aiResponse.ok ? 'up' : 'down';
        aiLatency = Date.now() - aiStart;
      } catch (error) {
        aiStatus = 'down';
        console.error('AI service health check failed:', error);
      }
    }

    return Response.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
        uptime: process.uptime(),
        checks: {
          database: { status: 'up', latency: dbLatency },
          redis: {
            status: redisHealth.status,
            latency: redisHealth.latency,
            error: redisHealth.error,
          },
          ai: { status: aiStatus, latency: aiLatency },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);

    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}
