/**
 * Server-side environment configuration
 * Includes sensitive variables, only use on server-side
 */

import { validateServerEnv } from './types';

function getEnv<T>(key: string, defaultValue?: T): T {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is required`);
  }
  return value as T;
}

const envVars = {
  // Server-only environment variables
  NODE_ENV: getEnv('NODE_ENV', 'development'),

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres',

  // Server configuration
  PORT: Number(getEnv('PORT', '3000')),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001',

  // AI Services
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,

  // External APIs
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  DEFILLAMA_API_KEY: process.env.DEFILLAMA_API_KEY,

  // Public environment variables (available on client)
  NEXT_PUBLIC_SERVER_URL: getEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3000'),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_DEFAULT_CHAIN: Number(getEnv('NEXT_PUBLIC_DEFAULT_CHAIN', '1')),
  NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

export const env = validateServerEnv(envVars);

// Fallback for development
export const devEnv = {
  NODE_ENV: 'development',
  POSTGRES_URL: 'postgres://postgres:postgres@localhost:5432/postgres',
  BETTER_AUTH_SECRET: 'development-secret-key-change-in-production',
  BETTER_AUTH_URL: 'http://localhost:3000',
  PORT: 3000,
  CORS_ORIGIN: 'http://localhost:3001',
  GOOGLE_AI_API_KEY: 'development-key',
  COINGECKO_API_KEY: 'development-key',
  DEFILLAMA_API_KEY: 'development-key',
  NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: 'development-project-id',
  NEXT_PUBLIC_REOWN_PROJECT_ID: 'development-reown-id',
  NEXT_PUBLIC_ALCHEMY_API_KEY: 'development-alchemy-key',
  NEXT_PUBLIC_DEFAULT_CHAIN: 1,
  NEXT_PUBLIC_ENABLE_TESTNETS: false,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: 'development-ga-id',
};
