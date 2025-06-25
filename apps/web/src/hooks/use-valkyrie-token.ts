import { getContractAddress } from '@valkyrie/config';
import { VALKYRIE_TOKEN_ABI } from '@valkyrie/contracts';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi';

// Helper to get typed contract address
function useValkyrieTokenAddress() {
  const chainId = useChainId();

  try {
    const address = getContractAddress(chainId, 'valkyrieToken');
    return address as `0x${string}`;
  } catch {
    // Return zero address if contract not deployed on current chain
    return '0x0000000000000000000000000000000000000000' as `0x${string}`;
  }
}

// Basic token information
export function useValkyrieTokenInfo() {
  const tokenAddress = useValkyrieTokenAddress();

  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'decimals',
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  return {
    tokenAddress,
    name: name || 'Valkyrie Token',
    symbol: symbol || 'VLK',
    decimals: decimals || 18,
    totalSupply,
    formattedTotalSupply: totalSupply ? formatUnits(totalSupply, decimals || 18) : '0',
  };
}

// User's token balance
export function useValkyrieTokenBalance() {
  const { address } = useAccount();
  const tokenAddress = useValkyrieTokenAddress();

  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'decimals',
  });

  return {
    balance,
    formattedBalance: balance ? formatUnits(balance, decimals || 18) : '0',
  };
}

// Governance information
export function useValkyrieGovernance() {
  const { address } = useAccount();
  const tokenAddress = useValkyrieTokenAddress();

  const { data: delegates } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'delegates',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: votes } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'decimals',
  });

  return {
    delegates,
    votes,
    isDelegated: delegates !== address,
    hasDelegated: !!delegates,
    formattedVotes: votes ? formatUnits(votes, decimals || 18) : '0',
  };
}

// Token operations
export function useValkyrieTokenOperations() {
  const { writeContract, isPending, error } = useWriteContract();
  const tokenAddress = useValkyrieTokenAddress();

  // Get decimals at hook level
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'decimals',
  });

  const approve = async (spender: `0x${string}`, amount: string) => {
    const parsedAmount = parseUnits(amount, decimals || 18);

    return writeContract({
      address: tokenAddress,
      abi: VALKYRIE_TOKEN_ABI,
      functionName: 'approve',
      args: [spender, parsedAmount],
    });
  };

  const delegate = async (delegatee: `0x${string}`) => {
    return writeContract({
      address: tokenAddress,
      abi: VALKYRIE_TOKEN_ABI,
      functionName: 'delegate',
      args: [delegatee],
    });
  };

  return {
    approve,
    delegate,
    isPending,
    error,
  };
}
