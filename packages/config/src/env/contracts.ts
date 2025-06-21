/**
 * Smart contract deployment environment configuration
 * Used by Foundry scripts and deployment tools
 */

import { type ContractEnvironment, validateContractEnv } from './types.js';

function getContractEnvVars(): Record<string, unknown> {
  if (typeof process === 'undefined') {
    throw new Error('Contract environment can only be accessed in Node.js environment');
  }

  return {
    // Base environment
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Private Keys (for deployment)
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,

    // Network RPC URLs
    MAINNET_RPC_URL: process.env.MAINNET_RPC_URL,
    SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
    ARBITRUM_RPC_URL: process.env.ARBITRUM_RPC_URL,
    OPTIMISM_RPC_URL: process.env.OPTIMISM_RPC_URL,
    POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
    BASE_RPC_URL: process.env.BASE_RPC_URL,
    ANVIL_RPC_URL: process.env.ANVIL_RPC_URL || 'http://localhost:8545',

    // Etherscan API Keys
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    ARBISCAN_API_KEY: process.env.ARBISCAN_API_KEY,
    OPTIMISTIC_ETHERSCAN_API_KEY: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
    POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
    BASESCAN_API_KEY: process.env.BASESCAN_API_KEY,

    // Tenderly Configuration
    TENDERLY_ACCESS_KEY: process.env.TENDERLY_ACCESS_KEY,
    TENDERLY_ACCOUNT_NAME: process.env.TENDERLY_ACCOUNT_NAME,
    TENDERLY_PROJECT_NAME: process.env.TENDERLY_PROJECT_NAME,
    TENDERLY_RPC_URL: process.env.TENDERLY_RPC_URL,

    // Contract Addresses
    VALKYRIE_TOKEN_ADDRESS: process.env.VALKYRIE_TOKEN_ADDRESS,
    VALKYRIE_VAULT_ADDRESS: process.env.VALKYRIE_VAULT_ADDRESS,
    VALKYRIE_PRICE_ORACLE_ADDRESS: process.env.VALKYRIE_PRICE_ORACLE_ADDRESS,

    // Deployment Configuration
    AI_CONTROLLER_ADDRESS: process.env.AI_CONTROLLER_ADDRESS,
    FEE_RECIPIENT_ADDRESS: process.env.FEE_RECIPIENT_ADDRESS,

    // Gas Configuration
    MAX_GAS_PRICE: Number(process.env.MAX_GAS_PRICE) || 50000000000,
    MAX_PRIORITY_FEE: Number(process.env.MAX_PRIORITY_FEE) || 2000000000,

    // Deployment Flags
    DEPLOY_VERIFY_CONTRACTS: process.env.DEPLOY_VERIFY_CONTRACTS !== 'false',
    DEPLOY_SAVE_DEPLOYMENTS: process.env.DEPLOY_SAVE_DEPLOYMENTS !== 'false',
  };
}

let contractEnv: ContractEnvironment;

try {
  contractEnv = validateContractEnv(getContractEnvVars());
  console.log('✅ Contract environment validation passed');
} catch (error) {
  console.error('❌ Contract environment validation failed:', error);

  // For contracts, we can be more lenient in development
  if (process.env.NODE_ENV === 'production') {
    throw error;
  } else {
    console.warn('🔄 Using fallback contract environment values...');
    contractEnv = validateContractEnv({
      NODE_ENV: 'development',
      ANVIL_RPC_URL: 'http://localhost:8545',
      MAX_GAS_PRICE: 50000000000,
      MAX_PRIORITY_FEE: 2000000000,
      DEPLOY_VERIFY_CONTRACTS: false,
      DEPLOY_SAVE_DEPLOYMENTS: true,
    });
  }
}

export { contractEnv };
export type { ContractEnvironment };
