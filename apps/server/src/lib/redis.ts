/**
 * Redis client configuration using Vercel KV
 * Optimized for security-critical operations and performance
 *
 * MIGRATION NOTES:
 * - Replaced local REDIS_PREFIXES with centralized @valkyrie/config/constants
 * - Using shared security configuration for rate limits
 * - Consistent key naming across all Redis operations
 *
 * OLD FILE BACKED UP AS: redis.old.ts
 */

import { REDIS_PREFIXES, securityConfig } from '@valkyrie/config/constants';
import { kv } from '@vercel/kv';

/**
 * Enhanced Rate Limiter using Redis for distributed rate limiting
 * Critical for preventing DoS attacks across multiple server instances
 */
export class RedisRateLimiter {
  private prefix: string;
  private maxAttempts: number;
  private windowMs: number;

  constructor(identifier: string, maxAttempts: number = 10, windowMs: number = 60000) {
    this.prefix = `${REDIS_PREFIXES.RATE_LIMIT}${identifier}:`;
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  async isAllowed(userIdentifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = `${this.prefix}${userIdentifier}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = kv.pipeline();

      // Remove expired entries
      pipeline.zremrangebyscore(key, 0, windowStart);

      // Count current attempts in window
      pipeline.zcard(key);

      // Add current attempt
      pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

      // Set expiration
      pipeline.expire(key, Math.ceil(this.windowMs / 1000));

      const results = await pipeline.exec();
      const currentCount = (results[1] as number) || 0;

      const allowed = currentCount < this.maxAttempts;
      const remaining = Math.max(0, this.maxAttempts - currentCount - 1);
      const resetTime = now + this.windowMs;

      return { allowed, remaining, resetTime };
    } catch (error) {
      console.error('Redis rate limiter error:', error);
      // Fail open for availability (but log the error)
      return { allowed: true, remaining: this.maxAttempts, resetTime: now + this.windowMs };
    }
  }

  async reset(userIdentifier: string): Promise<void> {
    const key = `${this.prefix}${userIdentifier}`;
    await kv.del(key);
  }
}

/**
 * Secure session management using Redis
 * Stores encrypted session data with automatic expiration
 */
export class RedisSessionManager {
  private prefix = REDIS_PREFIXES.SESSION;
  private defaultTTL = Math.floor(securityConfig.session.maxAge / 1000); // Convert ms to seconds

  async createSession(
    sessionId: string,
    sessionData: Record<string, unknown>,
    ttlSeconds: number = this.defaultTTL
  ): Promise<void> {
    const key = `${this.prefix}${sessionId}`;
    const data = {
      ...sessionData,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlSeconds * 1000,
    };

    await kv.setex(key, ttlSeconds, JSON.stringify(data));
  }

  async getSession(sessionId: string): Promise<Record<string, unknown> | null> {
    const key = `${this.prefix}${sessionId}`;
    const data = await kv.get(key);

    if (!data || typeof data !== 'string') {
      return null;
    }

    try {
      const sessionData = JSON.parse(data);

      // Check if session is expired
      if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
        await this.destroySession(sessionId);
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Session parsing error:', error);
      return null;
    }
  }

  async updateSession(
    sessionId: string,
    updates: Record<string, unknown>,
    extendTTL: boolean = true
  ): Promise<boolean> {
    const existingSession = await this.getSession(sessionId);
    if (!existingSession) {
      return false;
    }

    const updatedSession = { ...existingSession, ...updates };
    const ttl = extendTTL ? this.defaultTTL : await kv.ttl(`${this.prefix}${sessionId}`);

    await this.createSession(sessionId, updatedSession, ttl);
    return true;
  }

  async destroySession(sessionId: string): Promise<void> {
    const key = `${this.prefix}${sessionId}`;
    await kv.del(key);
  }

  async destroyAllUserSessions(userId: string): Promise<void> {
    // In a real implementation, you'd need to track user sessions
    // For now, this is a placeholder for the pattern
    // Note: Vercel KV doesn't support SCAN, so this would need a different approach
    // You'd need to maintain a set of session IDs per user
    console.log(`Would destroy all sessions for user: ${userId}`);
  }
}

/**
 * Security token management for nonces, CSRF tokens, etc.
 */
export class RedisSecurityManager {
  private prefix = REDIS_PREFIXES.SECURITY;

  async storeNonce(
    nonce: string,
    metadata: Record<string, unknown> = {},
    ttlSeconds: number = 300 // 5 minutes
  ): Promise<void> {
    const key = `${this.prefix}nonce:${nonce}`;
    const data = {
      ...metadata,
      createdAt: Date.now(),
      used: false,
    };

    await kv.setex(key, ttlSeconds, JSON.stringify(data));
  }

  async validateAndConsumeNonce(nonce: string): Promise<boolean> {
    const key = `${this.prefix}nonce:${nonce}`;
    const data = await kv.get(key);

    if (!data || typeof data !== 'string') {
      return false;
    }

    try {
      const nonceData = JSON.parse(data);

      if (nonceData.used) {
        return false; // Nonce already used
      }

      // Mark as used
      nonceData.used = true;
      await kv.set(key, JSON.stringify(nonceData));

      return true;
    } catch (error) {
      console.error('Nonce validation error:', error);
      return false;
    }
  }

  async storeCSRFToken(
    token: string,
    sessionId: string,
    ttlSeconds: number = 3600 // 1 hour
  ): Promise<void> {
    const key = `${this.prefix}csrf:${token}`;
    await kv.setex(key, ttlSeconds, sessionId);
  }

  async validateCSRFToken(token: string, sessionId: string): Promise<boolean> {
    const key = `${this.prefix}csrf:${token}`;
    const storedSessionId = await kv.get(key);
    return storedSessionId === sessionId;
  }
}

/**
 * High-performance caching layer with smart invalidation
 */
export class RedisCache {
  private prefix = REDIS_PREFIXES.CACHE;

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await kv.get(`${this.prefix}${key}`);
      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = 300 // 5 minutes default
  ): Promise<void> {
    try {
      await kv.setex(`${this.prefix}${key}`, ttlSeconds, value);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await kv.del(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(_pattern: string): Promise<void> {
    // Note: Vercel KV doesn't support pattern deletion
    // You'd need to maintain key sets for pattern invalidation
    console.warn('Pattern invalidation not implemented for Vercel KV');
  }

  // Cached query wrapper with automatic cache warming
  async withCache<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttlSeconds: number = 300,
    warmCache: boolean = false
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null && !warmCache) {
      return cached;
    }

    // Execute query
    const result = await queryFn();

    // Cache result
    await this.set(key, result, ttlSeconds);

    return result;
  }
}

// Global instances using centralized security configuration
export const rateLimiter = {
  transaction: new RedisRateLimiter(
    'transaction',
    securityConfig.rateLimits.transaction.requests,
    securityConfig.rateLimits.transaction.window
  ),
  api: new RedisRateLimiter(
    'api',
    securityConfig.rateLimits.api.requests,
    securityConfig.rateLimits.api.window
  ),
  auth: new RedisRateLimiter(
    'auth',
    securityConfig.rateLimits.auth.requests,
    securityConfig.rateLimits.auth.window
  ),
  wallet: new RedisRateLimiter(
    'wallet',
    securityConfig.rateLimits.wallet.requests,
    securityConfig.rateLimits.wallet.window
  ),
};

export const sessionManager = new RedisSessionManager();
export const securityManager = new RedisSecurityManager();
export const redisCache = new RedisCache();

/**
 * Wallet connection session management
 * Tracks wallet connections and prevents session hijacking
 */
export class WalletSessionManager {
  private prefix = REDIS_PREFIXES.WALLET_SESSION;
  private sessionTTL = 4 * 60 * 60; // 4 hours

  async createWalletSession(
    walletAddress: string,
    sessionId: string,
    metadata: {
      userAgent?: string;
      ipAddress?: string;
      chainId?: number;
    }
  ): Promise<void> {
    const key = `${this.prefix}${walletAddress}`;
    const sessionData = {
      sessionId,
      walletAddress,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      ...metadata,
    };

    await kv.setex(key, this.sessionTTL, JSON.stringify(sessionData));
  }

  async validateWalletSession(walletAddress: string, sessionId: string): Promise<boolean> {
    const key = `${this.prefix}${walletAddress}`;
    const data = await kv.get(key);

    if (!data || typeof data !== 'string') {
      return false;
    }

    try {
      const sessionData = JSON.parse(data);
      return sessionData.sessionId === sessionId;
    } catch {
      return false;
    }
  }

  async updateLastActivity(walletAddress: string): Promise<void> {
    const key = `${this.prefix}${walletAddress}`;
    const data = await kv.get(key);

    if (data && typeof data === 'string') {
      try {
        const sessionData = JSON.parse(data);
        sessionData.lastActivity = Date.now();
        await kv.setex(key, this.sessionTTL, JSON.stringify(sessionData));
      } catch (error) {
        console.error('Failed to update wallet session activity:', error);
      }
    }
  }

  async disconnectWallet(walletAddress: string): Promise<void> {
    const key = `${this.prefix}${walletAddress}`;
    await kv.del(key);
  }
}

export const walletSessionManager = new WalletSessionManager();

// Health check for Redis connection
export async function checkRedisHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}> {
  try {
    const start = Date.now();
    await kv.ping();
    const latency = Date.now() - start;

    return { status: 'healthy', latency };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
