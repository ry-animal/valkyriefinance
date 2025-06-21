/**
 * Network configuration types
 * Defines supported blockchain networks and their configurations
 */

export interface NetworkConfig {
  id: number;
  name: string;
  displayName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
  chainlinkPriceFeed?: string;
  multicallAddress?: string;
}

export type SupportedChain = 1 | 11155111 | 10 | 42161 | 137 | 8453 | 84532;

export interface ChainConfig {
  [chainId: number]: NetworkConfig;
}
