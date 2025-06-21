/**
 * @valkyrie/config - Shared configurations for Valkyrie Finance monorepo
 * Centralizes environment variables, network configs, contract addresses, and constants
 */

export * from './constants/index.js';
export type { AppConstants, SecurityConfig } from './constants/types.js';
export * from './contracts/index.js';
export type { ContractAddresses } from './contracts/types.js';
// Re-export all configuration modules
export * from './env/index.js';
// Export types for better TypeScript support
export type { Environment } from './env/types.js';
export * from './networks/index.js';
export type { NetworkConfig, SupportedChain } from './networks/types.js';
