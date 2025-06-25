import { getContractAddress } from '@valkyrie/config';
import { ERC4626_VAULT_ABI } from '@valkyrie/contracts';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi';

// Helper to get typed contract address
function useValkyrieVaultAddress() {
  const chainId = useChainId();

  try {
    const address = getContractAddress(chainId, 'valkyrieVault');
    return address as `0x${string}`;
  } catch {
    // Return zero address if contract not deployed on current chain
    return '0x0000000000000000000000000000000000000000' as `0x${string}`;
  }
}

export function useValkyrieVaultInfo() {
  const vaultAddress = useValkyrieVaultAddress();

  const { data: name } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'symbol',
  });

  const { data: asset } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'asset',
  });

  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'totalAssets',
  });

  const { data: totalSupply } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'totalSupply',
  });

  // Assume 18 decimals for now (standard for most tokens)
  const decimals = 18;

  return {
    vaultAddress,
    name: name || 'Valkyrie Vault',
    symbol: symbol || 'vVLK',
    asset,
    totalAssets: totalAssets || BigInt(0),
    totalSupply: totalSupply || BigInt(0),
    formattedTotalAssets: totalAssets ? formatUnits(totalAssets, decimals) : '0',
    formattedTotalSupply: totalSupply ? formatUnits(totalSupply, decimals) : '0',
  };
}

export function useValkyrieVaultOperations() {
  const { writeContract, isPending, error } = useWriteContract();
  const { address: userAddress } = useAccount();
  const vaultAddress = useValkyrieVaultAddress();

  // Assume 18 decimals for now
  const decimals = 18;

  const deposit = async (amount: string, receiver?: `0x${string}`) => {
    if (!userAddress) throw new Error('Wallet not connected');
    const parsedAmount = parseUnits(amount, decimals);

    return writeContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'deposit',
      args: [parsedAmount, receiver || userAddress],
    });
  };

  const withdraw = async (amount: string, receiver?: `0x${string}`, owner?: `0x${string}`) => {
    if (!userAddress) throw new Error('Wallet not connected');
    const parsedAmount = parseUnits(amount, decimals);

    return writeContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'withdraw',
      args: [parsedAmount, receiver || userAddress, owner || userAddress],
    });
  };

  const mint = async (shares: string, receiver?: `0x${string}`) => {
    if (!userAddress) throw new Error('Wallet not connected');
    const parsedShares = parseUnits(shares, decimals);

    return writeContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'mint',
      args: [parsedShares, receiver || userAddress],
    });
  };

  const redeem = async (shares: string, receiver?: `0x${string}`, owner?: `0x${string}`) => {
    if (!userAddress) throw new Error('Wallet not connected');
    const parsedShares = parseUnits(shares, decimals);

    return writeContract({
      address: vaultAddress,
      abi: ERC4626_VAULT_ABI,
      functionName: 'redeem',
      args: [parsedShares, receiver || userAddress, owner || userAddress],
    });
  };

  return {
    deposit,
    withdraw,
    mint,
    redeem,
    isPending,
    error,
  };
}

export function useValkyrieVaultBalance() {
  const { address } = useAccount();
  const vaultAddress = useValkyrieVaultAddress();

  const { data: shares } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const decimals = 18;

  return {
    shares: shares || BigInt(0),
    formattedShares: shares ? formatUnits(shares, decimals) : '0',
  };
}

// Legacy exports for backward compatibility
export const useVaultInfo = useValkyrieVaultInfo;
export const useVaultOperations = useValkyrieVaultOperations;
export const useVaultBalance = useValkyrieVaultBalance;

export function useVaultPreviewDeposit(assets: string) {
  const vaultAddress = useValkyrieVaultAddress();
  const decimals = 18;
  const parsedAssets = assets ? parseUnits(assets, decimals) : BigInt(0);

  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewDeposit',
    args: [parsedAssets],
    query: {
      enabled: !!assets && parsedAssets > BigInt(0),
    },
  });

  return { data, isLoading, error };
}

export function useVaultPreviewMint(shares: string) {
  const vaultAddress = useValkyrieVaultAddress();
  const decimals = 18;
  const parsedShares = shares ? parseUnits(shares, decimals) : BigInt(0);

  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewMint',
    args: [parsedShares],
    query: {
      enabled: !!shares && parsedShares > BigInt(0),
    },
  });

  return { data, isLoading, error };
}

export function useVaultPreviewWithdraw(assets: string) {
  const vaultAddress = useValkyrieVaultAddress();
  const decimals = 18;
  const parsedAssets = assets ? parseUnits(assets, decimals) : BigInt(0);

  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewWithdraw',
    args: [parsedAssets],
    query: {
      enabled: !!assets && parsedAssets > BigInt(0),
    },
  });

  return { data, isLoading, error };
}

export function useVaultPreviewRedeem(shares: string) {
  const vaultAddress = useValkyrieVaultAddress();
  const decimals = 18;
  const parsedShares = shares ? parseUnits(shares, decimals) : BigInt(0);

  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'previewRedeem',
    args: [parsedShares],
    query: {
      enabled: !!shares && parsedShares > BigInt(0),
    },
  });

  return { data, isLoading, error };
}

export function useAssetAllowance() {
  const vaultAddress = useValkyrieVaultAddress();

  // Get the underlying asset address
  const { data: assetAddress } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'asset',
  });

  // For now, return placeholder data since we'd need the asset ABI
  return {
    allowance: BigInt(0),
    assetAddress: (assetAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    formattedAllowance: '0.0',
    refetchAllowance: () => Promise.resolve(),
  };
}

export function useAssetApproval() {
  const vaultAddress = useValkyrieVaultAddress();

  // Get the underlying asset address
  const { data: assetAddress } = useReadContract({
    address: vaultAddress,
    abi: ERC4626_VAULT_ABI,
    functionName: 'asset',
  });

  return {
    approve: async (_amount: string) => {
      throw new Error('Asset approval requires asset ABI - to be implemented');
    },
    approveMax: async () => {
      throw new Error('Asset approval requires asset ABI - to be implemented');
    },
    isPending: false,
    error: null,
    assetAddress: (assetAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  };
}
