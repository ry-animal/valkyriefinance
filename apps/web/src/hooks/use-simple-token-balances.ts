import { useAccount, useChainId } from 'wagmi';
import { TOKENS_BY_CHAIN, useTokenBalance } from './use-token-balance';

export interface SimpleTokenBalance {
  address: `0x${string}`;
  symbol: string;
  balance: bigint;
  formattedBalance: string;
  decimals: number;
  isLoading: boolean;
}

export function useSimpleTokenBalances() {
  const chainId = useChainId();

  // Get tokens for current chain
  const chainTokens = TOKENS_BY_CHAIN[chainId as keyof typeof TOKENS_BY_CHAIN] || {};
  const tokenEntries = Object.entries(chainTokens);

  // Return mock data for now to avoid hook rule violations
  // TODO: Implement proper multi-token balance fetching
  const tokenBalances: SimpleTokenBalance[] = tokenEntries.map(([symbol, tokenAddress]) => ({
    address: tokenAddress,
    symbol,
    balance: BigInt(0),
    formattedBalance: '0.00',
    decimals: 18,
    isLoading: false,
  }));

  // Filter out tokens with zero balance
  const tokensWithBalance = tokenBalances.filter((token) => token.balance > BigInt(0));

  const isLoading = false;

  return {
    tokenBalances,
    tokensWithBalance,
    isLoading,
    chainId,
    supportedTokens: Object.keys(chainTokens),
  };
}
