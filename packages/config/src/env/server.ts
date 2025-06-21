/**
 * Server-side environment configuration
 * Includes sensitive variables, only use on server-side
 */

import { config } from 'dotenv';
import { type ServerEnvironment, validateServerEnv } from './types.js';

// Load environment variables from .env files
// Priority: .env.local > .env > .env.example
if (typeof process !== 'undefined') {
  config({ path: ['.env.local', '.env'] });
}

function getServerEnvVars(): Record<string, unknown> {
  if (typeof process === 'undefined') {
    throw new Error('Server environment can only be accessed on server-side');
  }

  return {
    // Base environment
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Client environment (also needed on server)
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_REOWN_PROJECT_ID:
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '1a91f40c774bfe7c56b13d36dc0fe7a6',
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_DEFAULT_CHAIN: Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN) || 1,
    NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
    NEXT_PUBLIC_ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT !== 'false',
    NEXT_PUBLIC_ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3 !== 'false',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,

    // Server-only environment
    DATABASE_URL: process.env.DATABASE_URL,
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    ARBITRUM_RPC_URL: process.env.ARBITRUM_RPC_URL,
    OPTIMISM_RPC_URL: process.env.OPTIMISM_RPC_URL,
    POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
    BASE_RPC_URL: process.env.BASE_RPC_URL,
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
    DEFILLAMA_API_KEY: process.env.DEFILLAMA_API_KEY,
    TENDERLY_ACCESS_KEY: process.env.TENDERLY_ACCESS_KEY,
    PORT: Number(process.env.PORT) || 3000,
  };
}

let serverEnv: ServerEnvironment;

try {
  serverEnv = validateServerEnv(getServerEnvVars());
  console.log('✅ Server environment validation passed');
} catch (error) {
  console.error('❌ Server environment validation failed:', error);

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    // Use minimal fallback for development
    console.warn('🔄 Using fallback server environment values...');
    serverEnv = validateServerEnv({
      NODE_ENV: 'development',
      NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
      NEXT_PUBLIC_REOWN_PROJECT_ID: '1a91f40c774bfe7c56b13d36dc0fe7a6',
      NEXT_PUBLIC_DEFAULT_CHAIN: 1,
      NEXT_PUBLIC_ENABLE_TESTNETS: false,
      NEXT_PUBLIC_ENABLE_AI_CHAT: true,
      NEXT_PUBLIC_ENABLE_WEB3: true,
      DATABASE_URL: 'postgresql://localhost:5432/valkyrie_dev',
      CORS_ORIGIN: 'http://localhost:3001',
      PORT: 3000,
    });
  }
}

export { serverEnv };
export type { ServerEnvironment };
