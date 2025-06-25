/**
 * Network configurations for all supported blockchains
 */

import type { ChainConfig, NetworkConfig } from './types.js';

// Mainnet configurations
export const ethereum: NetworkConfig = {
  id: 1,
  name: 'ethereum',
  displayName: 'Ethereum',
  rpcUrl: 'https://cloudflare-eth.com',
  blockExplorer: 'https://etherscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: false,
  chainlinkPriceFeed: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

export const optimism: NetworkConfig = {
  id: 10,
  name: 'optimism',
  displayName: 'Optimism',
  rpcUrl: 'https://mainnet.optimism.io',
  blockExplorer: 'https://optimistic.etherscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: false,
  chainlinkPriceFeed: '0x13e3Ee699D1909E989722E753853AE30b17e08c5', // ETH/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

export const arbitrum: NetworkConfig = {
  id: 42161,
  name: 'arbitrum',
  displayName: 'Arbitrum One',
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  blockExplorer: 'https://arbiscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: false,
  chainlinkPriceFeed: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612', // ETH/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

export const polygon: NetworkConfig = {
  id: 137,
  name: 'polygon',
  displayName: 'Polygon',
  rpcUrl: 'https://polygon-rpc.com',
  blockExplorer: 'https://polygonscan.com',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  testnet: false,
  chainlinkPriceFeed: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0', // MATIC/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

export const base: NetworkConfig = {
  id: 8453,
  name: 'base',
  displayName: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: false,
  chainlinkPriceFeed: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70', // ETH/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

// Testnet configurations
export const sepolia: NetworkConfig = {
  id: 11155111,
  name: 'sepolia',
  displayName: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: true,
  chainlinkPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306', // ETH/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

export const baseSepolia: NetworkConfig = {
  id: 84532,
  name: 'base-sepolia',
  displayName: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: true,
  chainlinkPriceFeed: '0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1', // ETH/USD
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

export const hyperliquid: NetworkConfig = {
  id: 998,
  name: 'hyperliquid',
  displayName: 'HyperLiquid',
  rpcUrl: 'https://api.hyperliquid.xyz/evm',
  blockExplorer: 'https://app.hyperliquid.xyz/explorer',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  testnet: false,
  isHyperLiquid: true,
  apiEndpoint: 'https://api.hyperliquid.xyz',
  wsEndpoint: 'wss://api.hyperliquid.xyz/ws',
};

// Chain configurations map
export const chains: ChainConfig = {
  [ethereum.id]: ethereum,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [polygon.id]: polygon,
  [base.id]: base,
  [sepolia.id]: sepolia,
  [baseSepolia.id]: baseSepolia,
  [hyperliquid.id]: hyperliquid,
};

// Helper functions
export function getChain(chainId: number): NetworkConfig | undefined {
  return chains[chainId];
}

export function getMainnetChains(): NetworkConfig[] {
  return Object.values(chains).filter((chain) => !chain.testnet);
}

export function getTestnetChains(): NetworkConfig[] {
  return Object.values(chains).filter((chain) => chain.testnet);
}

export function isTestnet(chainId: number): boolean {
  const chain = getChain(chainId);
  return chain?.testnet ?? false;
}

export function isHyperLiquid(chainId: number): boolean {
  const chain = getChain(chainId);
  return chain?.isHyperLiquid ?? false;
}

export function getHyperLiquidChains(): NetworkConfig[] {
  return Object.values(chains).filter((chain) => chain.isHyperLiquid);
}

export function getBlockExplorerUrl(
  chainId: number,
  hash: string,
  type: 'tx' | 'address' = 'tx'
): string {
  const chain = getChain(chainId);
  if (!chain) return '';

  return `${chain.blockExplorer}/${type}/${hash}`;
}

// Export all chains as array
export const allChains = Object.values(chains);
export const mainnetChains = getMainnetChains();
export const testnetChains = getTestnetChains();

export * from './types.js';
