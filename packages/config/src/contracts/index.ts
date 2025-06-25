/**
 * Contract addresses and deployment configurations
 */

import type { Address, ContractAddresses, DeploymentConfig } from './types.js';

// Ethereum Mainnet deployments
export const mainnetContracts: ContractAddresses = {
  valkyrieToken: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  valkyrieVault: '0x31E606C53ed1d96fD2e7a1BE5e76a8A63b3a1E2b',
  valkyriePriceOracle: '0x0000000000000000000000000000000000000000', // To be deployed
  valkyrieGovernance: '0x8BAF0C3a4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f10',
  valkyrieAutomation: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
};

// Arbitrum deployments
export const arbitrumContracts: ContractAddresses = {
  valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  valkyriePriceOracle: '0x0000000000000000000000000000000000000000',
  valkyrieGovernance: '0x0000000000000000000000000000000000000000',
  valkyrieAutomation: '0x0000000000000000000000000000000000000000',
};

// Optimism deployments
export const optimismContracts: ContractAddresses = {
  valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  valkyriePriceOracle: '0x0000000000000000000000000000000000000000',
  valkyrieGovernance: '0x0000000000000000000000000000000000000000',
  valkyrieAutomation: '0x0000000000000000000000000000000000000000',
};

// Polygon deployments
export const polygonContracts: ContractAddresses = {
  valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  valkyriePriceOracle: '0x0000000000000000000000000000000000000000',
  valkyrieGovernance: '0x0000000000000000000000000000000000000000',
  valkyrieAutomation: '0x0000000000000000000000000000000000000000',
};

// Sepolia testnet deployments
export const sepoliaContracts: ContractAddresses = {
  valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  valkyriePriceOracle: '0x0000000000000000000000000000000000000000',
  valkyrieGovernance: '0x0000000000000000000000000000000000000000',
  valkyrieAutomation: '0x0000000000000000000000000000000000000000',
};

// Base Sepolia deployments
export const baseSepoliaContracts: ContractAddresses = {
  valkyrieToken: '0x0000000000000000000000000000000000000000',
  valkyrieVault: '0x0000000000000000000000000000000000000000',
  valkyriePriceOracle: '0x0000000000000000000000000000000000000000',
  valkyrieGovernance: '0x0000000000000000000000000000000000000000',
  valkyrieAutomation: '0x0000000000000000000000000000000000000000',
};

// Local Anvil deployments
export const anvilContracts: ContractAddresses = {
  valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  valkyriePriceOracle: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  valkyrieGovernance: '0x0000000000000000000000000000000000000000',
  valkyrieAutomation: '0x0000000000000000000000000000000000000000',
};

// All deployments
export const deployments: DeploymentConfig = {
  1: mainnetContracts, // Ethereum
  10: optimismContracts, // Optimism
  137: polygonContracts, // Polygon
  42161: arbitrumContracts, // Arbitrum
  11155111: sepoliaContracts, // Sepolia
  84532: baseSepoliaContracts, // Base Sepolia
  31337: anvilContracts, // Local Anvil
};

// Helper functions
export function getContractAddress(
  chainId: number,
  contractName: keyof ContractAddresses
): Address {
  const deployment = deployments[chainId];
  const address = deployment?.[contractName];

  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }

  return address as Address;
}

export function getContractAddresses(chainId: number): Partial<ContractAddresses> {
  return deployments[chainId] || {};
}

export function isContractDeployed(
  chainId: number,
  contractName: keyof ContractAddresses
): boolean {
  try {
    const address = getContractAddress(chainId, contractName);
    return address !== '0x0000000000000000000000000000000000000000';
  } catch {
    return false;
  }
}

export * from './types.js';
