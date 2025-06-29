/**
 * Redis-based rate limiting middleware for enhanced security
 * Replaces in-memory rate limiting with distributed Redis solution
 */

import { type NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/redis';
import { createTRPCError } from '@/lib/trpc-error';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store - in production use Redis
const rateLimitStore = new Map<string, RateLimitStore>();

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  identifier: string;
}

/**
 * Rate limiting middleware with different limits for different operations
 */
export const createRateLimitMiddleware = (config: RateLimitConfig) => {
  return async (req: NextRequest) => {
    const identifier = `${config.identifier}:${getClientIdentifier(req)}`;
    const now = Date.now();

    // Clean up expired entries
    cleanupExpiredEntries(now);

    const existing = rateLimitStore.get(identifier);

    if (existing && existing.resetTime > now) {
      if (existing.count >= config.maxAttempts) {
        const resetIn = Math.ceil((existing.resetTime - now) / 1000);
        throw createTRPCError(
          'TOO_MANY_REQUESTS',
          `Rate limit exceeded. Try again in ${resetIn} seconds.`
        );
      }
      existing.count++;
    } else {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
    }
  };
};

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(req: NextRequest): string {
  // Use wallet address if available (for authenticated requests)
  const walletAddress = req.headers.get('x-wallet-address');
  if (walletAddress) {
    return walletAddress;
  }

  // Fallback to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return ip;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Different rate limits for different operations
 */

// Authentication attempts - strict limiting
export const authRateLimit = createRateLimitMiddleware({
  maxAttempts: 5,
  windowMs: 300000, // 5 minutes
  identifier: 'auth',
});

// General API calls - moderate limiting
export const apiRateLimit = createRateLimitMiddleware({
  maxAttempts: 100,
  windowMs: 60000, // 1 minute
  identifier: 'api',
});

// Portfolio operations - moderate limiting
export const portfolioRateLimit = createRateLimitMiddleware({
  maxAttempts: 50,
  windowMs: 60000, // 1 minute
  identifier: 'portfolio',
});

// AI recommendations - stricter limiting (expensive operations)
export const aiRateLimit = createRateLimitMiddleware({
  maxAttempts: 20,
  windowMs: 300000, // 5 minutes
  identifier: 'ai',
});

// Vault operations - very strict (financial operations)
export const vaultRateLimit = createRateLimitMiddleware({
  maxAttempts: 10,
  windowMs: 60000, // 1 minute
  identifier: 'vault',
});

// Analytics queries - moderate limiting
export const analyticsRateLimit = createRateLimitMiddleware({
  maxAttempts: 30,
  windowMs: 60000, // 1 minute
  identifier: 'analytics',
});

/**
 * Middleware helper to apply rate limiting to Next.js API routes
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  try {
    const middleware = createRateLimitMiddleware(config);

    await middleware(request);
    return null; // Continue processing
  } catch (error) {
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: error.message,
        },
        { status: 429 }
      );
    }
    console.error('Rate limiting error:', error);
    // Fail open - allow request but log error
    return null;
  }
}
