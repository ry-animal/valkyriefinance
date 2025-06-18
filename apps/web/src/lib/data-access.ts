import { cache } from 'react';

// Types for our data
export interface PortfolioStats {
  totalValue: string;
  totalYield: string;
  activePositions: number;
  pendingRewards: string;
  lastUpdated: string;
}

export interface VaultInfo {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  tvl: string;
  userBalance: string;
  isActive: boolean;
}

// Server-side data fetching functions with React.cache for deduplication
export const getPortfolioStats = cache(async (address?: string): Promise<PortfolioStats> => {
  // Simulate API call - replace with actual blockchain/API calls
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In production, this would call your backend API or blockchain
  // Example: const response = await fetch(`${process.env.API_URL}/portfolio/${address}`)
  
  return {
    totalValue: address ? '$127,450.32' : '$0.00',
    totalYield: address ? '24.7%' : '0.0%',
    activePositions: address ? 7 : 0,
    pendingRewards: address ? '$1,234.56' : '$0.00',
    lastUpdated: new Date().toISOString(),
  };
});

export const getVaultInfo = cache(async (vaultId: string): Promise<VaultInfo> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: vaultId,
    name: 'Valkyrie High Yield Vault',
    symbol: 'VHYV',
    apy: 24.7,
    tvl: '$127M',
    userBalance: '$12,450.32',
    isActive: true,
  };
});

export const getActiveVaults = cache(async (): Promise<VaultInfo[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'vault-1',
      name: 'Valkyrie High Yield Vault',
      symbol: 'VHYV',
      apy: 24.7,
      tvl: '$127M',
      userBalance: '$12,450.32',
      isActive: true,
    },
    {
      id: 'vault-2',
      name: 'Valkyrie Stable Vault',
      symbol: 'VSV',
      apy: 8.5,
      tvl: '$89M',
      userBalance: '$5,670.88',
      isActive: true,
    },
    // More vaults...
  ];
});

// Example of parallel data fetching to avoid waterfalls
export const getDashboardData = cache(async (userAddress?: string) => {
  // Initiate all requests in parallel
  const portfolioStatsPromise = getPortfolioStats(userAddress);
  const activeVaultsPromise = getActiveVaults();
  
  // Wait for all to complete
  const [portfolioStats, activeVaults] = await Promise.all([
    portfolioStatsPromise,
    activeVaultsPromise,
  ]);
  
  return {
    portfolioStats,
    activeVaults,
  };
}); 