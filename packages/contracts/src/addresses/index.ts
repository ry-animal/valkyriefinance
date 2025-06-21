/**
 * Contract addresses using centralized @valkyrie/config
 *
 * MIGRATION NOTES:
 * - Replaced hardcoded contract addresses with centralized configuration
 * - All contract addresses now managed in @valkyrie/config/contracts
 * - Consistent address management across all networks
 * - Type-safe contract address access
 *
 * OLD FILE BACKED UP AS: index.old.ts
 */

import { deployments, getContractAddress, isContractDeployed } from '@valkyrie/config/contracts';

// Re-export centralized contract addresses with legacy naming for backward compatibility
export const CONTRACT_ADDRESSES = deployments;

// Re-export types and functions from centralized config for backward compatibility
export type { ContractName, SupportedChainId } from '@valkyrie/config/contracts';
export { getContractAddress, isContractDeployed } from '@valkyrie/config/contracts';

// Helper function to check if chain is supported (using centralized config)
export function isSupportedChain(chainId: number): boolean {
  return isContractDeployed(chainId, 'valkyrieToken');
}

// Get all supported chain IDs from centralized config
export const SUPPORTED_CHAIN_IDS = Object.keys(CONTRACT_ADDRESSES).map((id) => parseInt(id));

// Contract deployment blocks (for event filtering)
export const DEPLOYMENT_BLOCKS = {
  1: 19_000_000, // Ethereum mainnet
  42161: 170_000_000, // Arbitrum
  10: 110_000_000, // Optimism
  137: 50_000_000, // Polygon
  11155111: 5_000_000, // Sepolia
  84532: 1_000_000, // Base Sepolia
  31337: 0, // Local Anvil
} as const;
