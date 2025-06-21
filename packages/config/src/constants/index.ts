/**
 * Application constants and configurations
 */

import type { AppConstants, SecurityConfig } from './types.js';

export const appConstants: AppConstants = {
  app: {
    name: 'Valkyrie Finance',
    version: '1.0.0',
    description: 'AI-Driven DeFi Platform',
    url: 'https://valkyrie.finance',
  },

  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    baseUrl: '/api',
  },

  ui: {
    defaultTheme: 'system',
    animationDuration: 200, // milliseconds
    toastDuration: 5000, // 5 seconds
  },

  defi: {
    slippageTolerance: 0.005, // 0.5%
    maxGasPrice: BigInt(50_000_000_000), // 50 gwei
    defaultDeadline: 1200, // 20 minutes
  },
};

export const securityConfig: SecurityConfig = {
  rateLimits: {
    api: { requests: 30, window: 60000 }, // 30 per minute
    transaction: { requests: 5, window: 60000 }, // 5 per minute
    auth: { requests: 10, window: 300000 }, // 10 per 5 minutes
    wallet: { requests: 20, window: 60000 }, // 20 per minute
  },

  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    renewThreshold: 30 * 60 * 1000, // 30 minutes before expiry
  },

  security: {
    csp: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
    hsts: true,
    frameOptions: 'DENY',
  },
};

// Redis key prefixes
export const REDIS_PREFIXES = {
  RATE_LIMIT: 'rl:',
  SESSION: 'sess:',
  CACHE: 'cache:',
  SECURITY: 'sec:',
  NONCE: 'nonce:',
  WALLET_SESSION: 'wallet:',
  API_CACHE: 'api:',
  USER_PREFS: 'prefs:',
} as const;

// Common validation patterns
export const VALIDATION_PATTERNS = {
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  PRIVATE_KEY: /^0x[a-fA-F0-9]{64}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  AI_CHAT: 'NEXT_PUBLIC_ENABLE_AI_CHAT',
  WEB3: 'NEXT_PUBLIC_ENABLE_WEB3',
  TESTNETS: 'NEXT_PUBLIC_ENABLE_TESTNETS',
} as const;

export * from './types.js';
