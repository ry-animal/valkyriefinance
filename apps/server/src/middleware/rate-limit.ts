/**
 * Redis-based rate limiting middleware for enhanced security
 * Replaces in-memory rate limiting with distributed Redis solution
 */

import { type NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/redis';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  identifier: 'transaction' | 'api' | 'auth' | 'wallet';
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (request: NextRequest, identifier: string): Promise<NextResponse | null> => {
    try {
      const limiter = rateLimiter[config.identifier];
      const result = await limiter.isAllowed(identifier);

      if (!result.allowed) {
        // Rate limit exceeded
        const response = NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          { status: 429 }
        );

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', config.maxAttempts.toString());
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
        response.headers.set(
          'Retry-After',
          Math.ceil((result.resetTime - Date.now()) / 1000).toString()
        );

        return response;
      }

      // Add rate limit info to successful responses
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', config.maxAttempts.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

      return null; // Continue processing
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request but log error
      return null;
    }
  };
}

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from session/auth header first
  const userId = request.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get wallet address from header
  const walletAddress = request.headers.get('x-wallet-address');
  if (walletAddress) {
    return `wallet:${walletAddress}`;
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';

  return `ip:${ip}`;
}

/**
 * Wallet-specific rate limiting
 */
export const walletRateLimit = createRateLimitMiddleware({
  maxAttempts: 20,
  windowMs: 60000, // 1 minute
  identifier: 'wallet',
});

/**
 * Transaction rate limiting
 */
export const transactionRateLimit = createRateLimitMiddleware({
  maxAttempts: 5,
  windowMs: 60000, // 1 minute
  identifier: 'transaction',
});

/**
 * API rate limiting
 */
export const apiRateLimit = createRateLimitMiddleware({
  maxAttempts: 30,
  windowMs: 60000, // 1 minute
  identifier: 'api',
});

/**
 * Authentication rate limiting
 */
export const authRateLimit = createRateLimitMiddleware({
  maxAttempts: 10,
  windowMs: 300000, // 5 minutes
  identifier: 'auth',
});

/**
 * Express/Next.js middleware wrapper
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const identifier = getClientIdentifier(request);
    const middleware = createRateLimitMiddleware(config);

    const rateLimitResponse = await middleware(request, identifier);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    return handler(request);
  };
}
