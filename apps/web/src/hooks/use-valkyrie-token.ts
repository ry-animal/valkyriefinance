import { getContractAddress, VALKYRIE_TOKEN_ABI } from '@valkyrie/contracts';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi';
import { useWeb3Store } from '@/stores/web3-store';

// Basic token information
export function useValkyrieTokenInfo() {
  const chainId = useChainId();
  const tokenAddress = getContractAddress(chainId, 'valkyrieToken');

  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'name',
    query: { enabled: !!tokenAddress },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'decimals',
    query: { enabled: !!tokenAddress },
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddress },
  });

  return {
    tokenAddress,
    name,
    symbol,
    decimals,
    totalSupply,
    formattedTotalSupply: totalSupply ? formatUnits(totalSupply, 18) : '0',
  };
}

// User's token balance and staking info
export function useValkyrieTokenBalance() {
  const { address } = useAccount();
  const chainId = useChainId();
  const tokenAddress = getContractAddress(chainId, 'valkyrieToken');

  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!tokenAddress && !!address },
  });

  const { data: stakedBalance } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'stakedBalance',
    args: [address!],
    query: { enabled: !!tokenAddress && !!address },
  });

  const { data: pendingRewards } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'pendingRewards',
    args: [address!],
    query: { enabled: !!tokenAddress && !!address },
  });

  return {
    balance,
    stakedBalance,
    pendingRewards,
    formattedBalance: balance ? formatUnits(balance, 18) : '0',
    formattedStakedBalance: stakedBalance ? formatUnits(stakedBalance, 18) : '0',
    formattedPendingRewards: pendingRewards ? formatUnits(pendingRewards, 18) : '0',
  };
}

// Governance information
export function useValkyrieGovernance() {
  const { address } = useAccount();
  const chainId = useChainId();
  const tokenAddress = getContractAddress(chainId, 'valkyrieToken');

  const { data: delegates } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'delegates',
    args: [address!],
    query: { enabled: !!tokenAddress && !!address },
  });

  const { data: votes } = useReadContract({
    address: tokenAddress,
    abi: VALKYRIE_TOKEN_ABI,
    functionName: 'getVotes',
    args: [address!],
    query: { enabled: !!tokenAddress && !!address },
  });

  const isDelegated = delegates !== address;
  const hasDelegated = delegates && delegates !== '0x0000000000000000000000000000000000000000';

  return {
    delegates,
    votes,
    isDelegated,
    hasDelegated,
    formattedVotes: votes ? formatUnits(votes, 18) : '0',
  };
}

// Token operations
export function useValkyrieTokenOperations() {
  const { address } = useAccount();
  const chainId = useChainId();
  const tokenAddress = getContractAddress(chainId, 'valkyrieToken');
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { addTransaction } = useWeb3Store();

  const stake = async (amount: string) => {
    if (!tokenAddress || !address) throw new Error('Wallet not connected');

    const amountWei = parseUnits(amount, 18);

    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: VALKYRIE_TOKEN_ABI,
        functionName: 'stake',
        args: [amountWei],
      });

      addTransaction({
        hash,
        type: 'deposit',
        status: 'pending',
        chainId,
        amount: formatUnits(amountWei, 18),
        token: 'VLKR',
      });

      return hash;
    } catch (error) {
      console.error('Token stake failed:', error);
      throw error;
    }
  };

  const unstake = async (amount: string) => {
    if (!tokenAddress || !address) throw new Error('Wallet not connected');

    const amountWei = parseUnits(amount, 18);

    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: VALKYRIE_TOKEN_ABI,
        functionName: 'unstake',
        args: [amountWei],
      });

      addTransaction({
        hash,
        type: 'withdrawal',
        status: 'pending',
        chainId,
        amount: formatUnits(amountWei, 18),
        token: 'VLKR',
      });

      return hash;
    } catch (error) {
      console.error('Token unstake failed:', error);
      throw error;
    }
  };

  const claimRewards = async () => {
    if (!tokenAddress || !address) throw new Error('Wallet not connected');

    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: VALKYRIE_TOKEN_ABI,
        functionName: 'claimRewards',
      });

      addTransaction({
        hash,
        type: 'withdrawal',
        status: 'pending',
        chainId,
        token: 'VLKR Rewards',
      });

      return hash;
    } catch (error) {
      console.error('Claim rewards failed:', error);
      throw error;
    }
  };

  const delegate = async (delegatee: `0x${string}`) => {
    if (!tokenAddress || !address) throw new Error('Wallet not connected');

    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: VALKYRIE_TOKEN_ABI,
        functionName: 'delegate',
        args: [delegatee],
      });

      addTransaction({
        hash,
        type: 'approve',
        status: 'pending',
        chainId,
        token: 'Governance',
      });

      return hash;
    } catch (error) {
      console.error('Delegate failed:', error);
      throw error;
    }
  };

  const approve = async (spender: `0x${string}`, amount: string) => {
    if (!tokenAddress) throw new Error('Token address not found');

    const amountWei = parseUnits(amount, 18);

    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: VALKYRIE_TOKEN_ABI,
        functionName: 'approve',
        args: [spender, amountWei],
      });

      addTransaction({
        hash,
        type: 'approve',
        status: 'pending',
        chainId,
        amount: formatUnits(amountWei, 18),
        token: 'VLKR',
      });

      return hash;
    } catch (error) {
      console.error('Token approval failed:', error);
      throw error;
    }
  };

  return {
    stake,
    unstake,
    claimRewards,
    delegate,
    approve,
    isPending,
    error,
  };
}
