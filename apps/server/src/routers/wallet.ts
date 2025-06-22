/**
 * Wallet router with Redis-backed security features
 * Demonstrates session management, rate limiting, and secure caching
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  rateLimiter,
  redisCache,
  securityManager,
  sessionManager,
  walletSessionManager,
} from '@/lib/redis';
import { publicProcedure, router } from '@/lib/trpc';

// Input validation schemas
const walletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format');

const signatureSchema = z.object({
  signature: z.string().min(1, 'Signature required'),
  message: z.string().min(1, 'Message required'),
  address: walletAddressSchema,
});

// Type definitions for cached data
interface WalletMetadata {
  address: string;
  chainId: number;
  lastConnected: number;
  sessionId: string;
}

interface WalletVerificationStatus {
  verified: boolean;
  verifiedAt: number;
}

export const walletRouter = router({
  /**
   * Connect wallet with Redis session management
   */
  connect: publicProcedure
    .input(
      z.object({
        address: walletAddressSchema,
        chainId: z.number().int().positive(),
        userAgent: z.string().optional(),
        ipAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { address, chainId, userAgent, ipAddress } = input;

      // Rate limiting check
      const rateLimitResult = await rateLimiter.wallet.isAllowed(`connect:${address}`);
      if (!rateLimitResult.allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many connection attempts. Please try again later.',
        });
      }

      try {
        // Generate secure session ID
        const sessionId = crypto.randomUUID();

        // Create wallet session in Redis
        await walletSessionManager.createWalletSession(address, sessionId, {
          userAgent,
          ipAddress,
          chainId,
        });

        // Generate nonce for signature verification
        const nonce = crypto.randomUUID();
        await securityManager.storeNonce(nonce, {
          walletAddress: address,
          sessionId,
          purpose: 'wallet_verification',
        });

        // Cache wallet metadata
        await redisCache.set(
          `wallet:metadata:${address}`,
          {
            address,
            chainId,
            lastConnected: Date.now(),
            sessionId,
          },
          3600 // 1 hour cache
        );

        return {
          sessionId,
          nonce,
          message: `Connect to Valkyrie Finance\nNonce: ${nonce}\nTimestamp: ${Date.now()}`,
          expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
        };
      } catch (error) {
        console.error('Wallet connection error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to establish wallet connection',
        });
      }
    }),

  /**
   * Verify wallet signature with nonce validation
   */
  verify: publicProcedure
    .input(
      signatureSchema.extend({
        nonce: z.string().uuid('Invalid nonce format'),
        sessionId: z.string().uuid('Invalid session ID'),
      })
    )
    .mutation(async ({ input }) => {
      const { signature, address, nonce, sessionId } = input;

      // Rate limiting for verification attempts
      const rateLimitResult = await rateLimiter.auth.isAllowed(`verify:${address}`);
      if (!rateLimitResult.allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many verification attempts. Please try again later.',
        });
      }

      try {
        // Validate session exists
        const isValidSession = await walletSessionManager.validateWalletSession(address, sessionId);
        if (!isValidSession) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired session',
          });
        }

        // Validate and consume nonce
        const isValidNonce = await securityManager.validateAndConsumeNonce(nonce);
        if (!isValidNonce) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or expired nonce',
          });
        }

        // Here you would verify the signature using ethers.js or similar
        // For now, we'll simulate signature verification
        const isValidSignature = signature.length > 100; // Placeholder validation

        if (!isValidSignature) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid signature',
          });
        }

        // Update session with verification status
        await walletSessionManager.updateLastActivity(address);

        // Create authenticated session
        await sessionManager.createSession(sessionId, {
          walletAddress: address,
          verified: true,
          verifiedAt: Date.now(),
        });

        // Cache verification status
        await redisCache.set(
          `wallet:verified:${address}`,
          { verified: true, verifiedAt: Date.now() },
          3600 // 1 hour
        );

        return {
          verified: true,
          sessionId,
          walletAddress: address,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Signature verification error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Verification failed',
        });
      }
    }),

  /**
   * Get wallet session info with caching
   */
  getSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        address: walletAddressSchema,
      })
    )
    .query(async ({ input }) => {
      const { sessionId, address } = input;

      try {
        // Check cache first
        const cached = await redisCache.get<unknown>(`session:${sessionId}`);
        if (cached) {
          return cached;
        }

        // Validate session
        const isValid = await walletSessionManager.validateWalletSession(address, sessionId);
        if (!isValid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid session',
          });
        }

        // Get session data
        const sessionData = await sessionManager.getSession(sessionId);
        if (!sessionData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Session not found',
          });
        }

        // Cache result
        await redisCache.set(`session:${sessionId}`, sessionData, 300); // 5 minutes

        return sessionData;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Session retrieval error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve session',
        });
      }
    }),

  /**
   * Disconnect wallet and cleanup sessions
   */
  disconnect: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        address: walletAddressSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { sessionId, address } = input;

      try {
        // Cleanup wallet session
        await walletSessionManager.disconnectWallet(address);

        // Cleanup main session
        await sessionManager.destroySession(sessionId);

        // Clear cached data
        await redisCache.del(`wallet:metadata:${address}`);
        await redisCache.del(`wallet:verified:${address}`);
        await redisCache.del(`session:${sessionId}`);

        return { success: true };
      } catch (error) {
        console.error('Wallet disconnect error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to disconnect wallet',
        });
      }
    }),

  /**
   * Get wallet connection status
   */
  getConnectionStatus: publicProcedure
    .input(
      z.object({
        address: walletAddressSchema,
      })
    )
    .query(async ({ input }) => {
      const { address } = input;

      try {
        // Check cached metadata
        const metadata = await redisCache.get<WalletMetadata>(`wallet:metadata:${address}`);
        const verified = await redisCache.get<WalletVerificationStatus>(
          `wallet:verified:${address}`
        );

        return {
          connected: !!metadata,
          verified: !!verified?.verified,
          lastConnected: metadata?.lastConnected,
          chainId: metadata?.chainId,
          sessionId: metadata?.sessionId,
        };
      } catch (error) {
        console.error('Connection status error:', error);
        return {
          connected: false,
          verified: false,
        };
      }
    }),

  /**
   * Get rate limit status for debugging
   */
  getRateLimitStatus: publicProcedure
    .input(
      z.object({
        address: walletAddressSchema,
        type: z.enum(['wallet', 'auth', 'transaction']),
      })
    )
    .query(async ({ input }) => {
      const { address, type } = input;

      try {
        const limiter = rateLimiter[type];
        const result = await limiter.isAllowed(address);

        return {
          allowed: result.allowed,
          remaining: result.remaining,
          resetTime: result.resetTime,
          type,
        };
      } catch (error) {
        console.error('Rate limit status error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get rate limit status',
        });
      }
    }),
});
