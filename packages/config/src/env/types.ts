/**
 * Environment configuration types
 * Shared across all applications in the monorepo
 */

import { z } from 'zod';

// Base environment schema that all apps extend
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Client-side environment (public variables only)
export const clientEnvSchema = z.object({
  // Server URLs
  NEXT_PUBLIC_SERVER_URL: z.string().url('Invalid server URL'),

  // Wallet Connect & Web3
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_REOWN_PROJECT_ID: z.string().default('1a91f40c774bfe7c56b13d36dc0fe7a6'),
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),

  // Network Configuration
  NEXT_PUBLIC_DEFAULT_CHAIN: z.coerce.number().default(1),
  NEXT_PUBLIC_ENABLE_TESTNETS: z.coerce.boolean().default(false),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
});

// Server-side environment (includes sensitive variables)
export const serverEnvSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().url('Invalid database URL'),

  // Redis Configuration (Vercel KV)
  KV_URL: z.string().url('Invalid KV URL').optional(),
  KV_REST_API_URL: z.string().url('Invalid KV REST API URL').optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  KV_REST_API_READ_ONLY_TOKEN: z.string().optional(),

  // CORS Configuration
  CORS_ORIGIN: z.string().url('Invalid CORS origin URL'),

  // AI Configuration
  GOOGLE_AI_API_KEY: z.string().optional(),

  // Blockchain RPC URLs
  ETHEREUM_RPC_URL: z.string().url().optional(),
  ARBITRUM_RPC_URL: z.string().url().optional(),
  OPTIMISM_RPC_URL: z.string().url().optional(),
  POLYGON_RPC_URL: z.string().url().optional(),
  BASE_RPC_URL: z.string().url().optional(),

  // External API Keys
  COINGECKO_API_KEY: z.string().optional(),
  DEFILLAMA_API_KEY: z.string().optional(),
  TENDERLY_ACCESS_KEY: z.string().optional(),

  // Server Configuration
  PORT: z.coerce.number().default(3000),
});

// Smart contract deployment environment
export const contractEnvSchema = z.object({
  // Private Keys (for deployment)
  PRIVATE_KEY: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid private key format')
    .optional(),
  DEPLOYER_PRIVATE_KEY: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid deployer private key')
    .optional(),

  // Network RPC URLs
  MAINNET_RPC_URL: z.string().url().optional(),
  SEPOLIA_RPC_URL: z.string().url().optional(),
  ARBITRUM_RPC_URL: z.string().url().optional(),
  OPTIMISM_RPC_URL: z.string().url().optional(),
  POLYGON_RPC_URL: z.string().url().optional(),
  BASE_RPC_URL: z.string().url().optional(),
  ANVIL_RPC_URL: z.string().url().default('http://localhost:8545'),

  // Etherscan API Keys (for verification)
  ETHERSCAN_API_KEY: z.string().optional(),
  ARBISCAN_API_KEY: z.string().optional(),
  OPTIMISTIC_ETHERSCAN_API_KEY: z.string().optional(),
  POLYGONSCAN_API_KEY: z.string().optional(),
  BASESCAN_API_KEY: z.string().optional(),

  // Tenderly Configuration
  TENDERLY_ACCESS_KEY: z.string().optional(),
  TENDERLY_ACCOUNT_NAME: z.string().optional(),
  TENDERLY_PROJECT_NAME: z.string().optional(),
  TENDERLY_RPC_URL: z.string().url().optional(),

  // Contract Addresses (populated after deployment)
  VALKYRIE_TOKEN_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  VALKYRIE_VAULT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  VALKYRIE_PRICE_ORACLE_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),

  // Deployment Configuration
  AI_CONTROLLER_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  FEE_RECIPIENT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),

  // Gas Configuration
  MAX_GAS_PRICE: z.coerce.number().default(50000000000), // 50 gwei
  MAX_PRIORITY_FEE: z.coerce.number().default(2000000000), // 2 gwei

  // Deployment Flags
  DEPLOY_VERIFY_CONTRACTS: z.coerce.boolean().default(true),
  DEPLOY_SAVE_DEPLOYMENTS: z.coerce.boolean().default(true),
});

// Combined schemas for different environments
export const fullClientEnvSchema = baseEnvSchema.merge(clientEnvSchema);
export const fullServerEnvSchema = baseEnvSchema.merge(serverEnvSchema).merge(clientEnvSchema);
export const fullContractEnvSchema = baseEnvSchema.merge(contractEnvSchema);

// Type exports
export type Environment = z.infer<typeof baseEnvSchema>;
export type ClientEnvironment = z.infer<typeof fullClientEnvSchema>;
export type ServerEnvironment = z.infer<typeof fullServerEnvSchema>;
export type ContractEnvironment = z.infer<typeof fullContractEnvSchema>;

// Environment validation functions
export function validateClientEnv(env: Record<string, unknown>): ClientEnvironment {
  return fullClientEnvSchema.parse(env);
}

export function validateServerEnv(env: Record<string, unknown>): ServerEnvironment {
  return fullServerEnvSchema.parse(env);
}

export function validateContractEnv(env: Record<string, unknown>): ContractEnvironment {
  return fullContractEnvSchema.parse(env);
}
