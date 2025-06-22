/**
 * Client-side environment configuration
 * Safe for use in browser environments (public variables only)
 */

import { type ClientEnvironment, validateClientEnv } from './types';

function getClientEnvVars(): Record<string, unknown> {
  if (typeof window === 'undefined') {
    // Server-side: use process.env
    return {
      NODE_ENV: process.env.NODE_ENV || 'development',
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      NEXT_PUBLIC_REOWN_PROJECT_ID:
        process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '1a91f40c774bfe7c56b13d36dc0fe7a6',
      NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      NEXT_PUBLIC_DEFAULT_CHAIN: Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN) || 1,
      NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    };
  } else {
    // Client-side: use window.env or process.env
    return {
      NODE_ENV: process.env.NODE_ENV || 'development',
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      NEXT_PUBLIC_REOWN_PROJECT_ID:
        process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '1a91f40c774bfe7c56b13d36dc0fe7a6',
      NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      NEXT_PUBLIC_DEFAULT_CHAIN: Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN) || 1,
      NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    };
  }
}

let clientEnv: ClientEnvironment;

try {
  clientEnv = validateClientEnv(getClientEnvVars());
  console.log('✅ Client environment validation passed');
} catch (error) {
  console.error('❌ Client environment validation failed:', error);

  // Use fallback for development
  console.warn('🔄 Using fallback client environment values...');
  clientEnv = validateClientEnv({
    NODE_ENV: 'development',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
    NEXT_PUBLIC_REOWN_PROJECT_ID: '1a91f40c774bfe7c56b13d36dc0fe7a6',
    NEXT_PUBLIC_DEFAULT_CHAIN: 1,
    NEXT_PUBLIC_ENABLE_TESTNETS: false,
  });
}

export { clientEnv };
export type { ClientEnvironment };
