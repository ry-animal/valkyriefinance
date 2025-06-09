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

export const COMMON_TOKENS = {
  USDC: '0xA0b86a33E6441d5f95c0d7b5C5dB0Ab01B2B5Fef' as `0x${string}`,
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
}
