import { useAccount, useChainId } from 'wagmi'
import { useTokenBalance, TOKENS_BY_CHAIN } from './use-token-balance'

export interface SimpleTokenBalance {
  address: `0x${string}`
  symbol: string
  balance: bigint
  formattedBalance: string
  decimals: number
  isLoading: boolean
}

export function useSimpleTokenBalances() {
  const { address } = useAccount()
  const chainId = useChainId()
  
  // Get tokens for current chain
  const chainTokens = TOKENS_BY_CHAIN[chainId as keyof typeof TOKENS_BY_CHAIN] || {}
  const tokenEntries = Object.entries(chainTokens)
  
  // Use individual hooks for each token (simpler but more hooks)
  const tokenBalances: SimpleTokenBalance[] = tokenEntries.map(([symbol, tokenAddress]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { balance, formattedBalance, decimals, symbol: tokenSymbol, isLoading } = useTokenBalance(tokenAddress)
    
    return {
      address: tokenAddress,
      symbol: tokenSymbol,
      balance,
      formattedBalance,
      decimals,
      isLoading,
    }
  })

  // Filter out tokens with zero balance
  const tokensWithBalance = tokenBalances.filter(token => 
    token.balance > BigInt(0)
  )

  const isLoading = tokenBalances.some(token => token.isLoading)

  return {
    tokenBalances,
    tokensWithBalance,
    isLoading,
    chainId,
    supportedTokens: Object.keys(chainTokens),
  }
} 