/**
 * Client-side environment configuration
 * Safe for use in browser environments (public variables only)
 */

import { type ClientEnvironment, validateClientEnv } from './types.js';

function getClientEnvVars(): Record<string, unknown> {
  // Only access environment variables that are safe for client-side
  const env = typeof window === 'undefined' ? process.env : {};

  return {
    NODE_ENV: env.NODE_ENV || 'development',
    NEXT_PUBLIC_SERVER_URL: env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_REOWN_PROJECT_ID:
      env.NEXT_PUBLIC_REOWN_PROJECT_ID || '1a91f40c774bfe7c56b13d36dc0fe7a6',
    NEXT_PUBLIC_ALCHEMY_API_KEY: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_DEFAULT_CHAIN: Number(env.NEXT_PUBLIC_DEFAULT_CHAIN) || 1,
    NEXT_PUBLIC_ENABLE_TESTNETS: env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
    NEXT_PUBLIC_ENABLE_AI_CHAT: env.NEXT_PUBLIC_ENABLE_AI_CHAT !== 'false',
    NEXT_PUBLIC_ENABLE_WEB3: env.NEXT_PUBLIC_ENABLE_WEB3 !== 'false',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
}

let clientEnv: ClientEnvironment;

try {
  clientEnv = validateClientEnv(getClientEnvVars());
} catch (error) {
  console.error('❌ Client environment validation failed:', error);
  // Use fallback values for client-side safety
  clientEnv = validateClientEnv({
    NODE_ENV: 'development',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
    NEXT_PUBLIC_REOWN_PROJECT_ID: '1a91f40c774bfe7c56b13d36dc0fe7a6',
    NEXT_PUBLIC_DEFAULT_CHAIN: 1,
    NEXT_PUBLIC_ENABLE_TESTNETS: false,
    NEXT_PUBLIC_ENABLE_AI_CHAT: true,
    NEXT_PUBLIC_ENABLE_WEB3: true,
  });
}

export { clientEnv };
export type { ClientEnvironment };
