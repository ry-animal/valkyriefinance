import { useReadContract, useAccount } from 'wagmi'
import { formatUnits } from 'viem'

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function useTokenBalance(tokenAddress?: `0x${string}`) {
  const { address } = useAccount()

  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenAddress },
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: !!tokenAddress },
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress },
  })

  const formattedBalance = balance && decimals 
    ? formatUnits(balance, decimals)
    : '0'

  return {
    balance: balance || BigInt(0),
    formattedBalance,
    decimals: decimals || 18,
    symbol: symbol || 'TOKEN',
    isLoading: !balance && !!address && !!tokenAddress,
  }
}

// Multi-chain token addresses
export const TOKENS_BY_CHAIN = {
  // Ethereum Mainnet (Chain ID: 1)
  1: {
    USDC: '0xA0b86a33E6441d5f95c0d7b5C5dB0Ab01B2B5Fef' as `0x${string}`,
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as `0x${string}`,
  },
  // Arbitrum (Chain ID: 42161)
  42161: {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as `0x${string}`,
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as `0x${string}`,
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`,
    ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548' as `0x${string}`,
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' as `0x${string}`,
  },
  // Optimism (Chain ID: 10)
  10: {
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' as `0x${string}`,
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58' as `0x${string}`,
    WETH: '0x4200000000000000000000000000000000000006' as `0x${string}`,
    OP: '0x4200000000000000000000000000000000000042' as `0x${string}`,
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' as `0x${string}`,
  },
  // Polygon (Chain ID: 137)
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' as `0x${string}`,
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as `0x${string}`,
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' as `0x${string}`,
    MATIC: '0x0000000000000000000000000000000000001010' as `0x${string}`,
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' as `0x${string}`,
  },
} as const

// Legacy export for backwards compatibility
export const COMMON_TOKENS = TOKENS_BY_CHAIN[1]

// Helper function to get token address for current chain
export function getTokenAddress(chainId: number, symbol: string): `0x${string}` | undefined {
  const chainTokens = TOKENS_BY_CHAIN[chainId as keyof typeof TOKENS_BY_CHAIN]
  return chainTokens?.[symbol as keyof typeof chainTokens]
}
