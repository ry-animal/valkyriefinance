// Contract addresses by chain ID
export const CONTRACT_ADDRESSES = {
  // Ethereum Mainnet (1)
  1: {
    valkryieToken: '0x742d35Cc674C4532A93a5C18d6f8C0C2a16055a8' as `0x${string}`,
    valkryieVault: '0x31E606C53ed1d96fD2e7a1bE5e76a8A63b3a1e2b' as `0x${string}`,
    uniswapV4PoolManager: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24' as `0x${string}`,
    governance: '0x8BAF0C3a4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f10' as `0x${string}`,
  },
  // Arbitrum (42161)
  42161: {
    valkryieToken: '0x93a5C18d6f8C0C2a16055a8742d35Cc674C4532A' as `0x${string}`,
    valkryieVault: '0xC53ed1d96fD2e7a1bE5e76a8A63b3a1e2b31E606' as `0x${string}`,
    uniswapV4PoolManager: '0x752ba5DBc23f44D87826276BF6Fd6b1C372aD244' as `0x${string}`,
    governance: '0xAF0C3a4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f108B' as `0x${string}`,
  },
  // Optimism (10)
  10: {
    valkryieToken: '0x5C18d6f8C0C2a16055a8742d35Cc674C4532A93a' as `0x${string}`,
    valkryieVault: '0x3ed1d96fD2e7a1bE5e76a8A63b3a1e2b31E606C5' as `0x${string}`,
    uniswapV4PoolManager: '0x2ba5DBc23f44D87826276BF6Fd6b1C372aD24475' as `0x${string}`,
    governance: '0x0C3a4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f108BAF' as `0x${string}`,
  },
  // Polygon (137)
  137: {
    valkryieToken: '0x18d6f8C0C2a16055a8742d35Cc674C4532A93a5C' as `0x${string}`,
    valkryieVault: '0x1d96fD2e7a1bE5e76a8A63b3a1e2b31E606C53ed' as `0x${string}`,
    uniswapV4PoolManager: '0xa5DBc23f44D87826276BF6Fd6b1C372aD244752b' as `0x${string}`,
    governance: '0x3a4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f108BAF0C' as `0x${string}`,
  },
  // Sepolia Testnet (11155111)
  11155111: {
    valkryieToken: '0xd6f8C0C2a16055a8742d35Cc674C4532A93a5C18' as `0x${string}`,
    valkryieVault: '0x96fD2e7a1bE5e76a8A63b3a1e2b31E606C53ed1d' as `0x${string}`,
    uniswapV4PoolManager: '0xDBc23f44D87826276BF6Fd6b1C372aD244752ba5' as `0x${string}`,
    governance: '0x4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f108BAF0C3a' as `0x${string}`,
  },
  // Local Anvil Network (31337)
  31337: {
    valkryieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
    valkryieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    mockUSDC: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  },
} as const

export type ContractName = 'valkryieToken' | 'valkryieVault' | 'uniswapV4PoolManager' | 'governance'
export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES

// Helper function to get contract address
export function getContractAddress(
  chainId: number,
  contractName: ContractName
): `0x${string}` | undefined {
  return CONTRACT_ADDRESSES[chainId as SupportedChainId]?.[contractName]
}

// Helper function to check if chain is supported
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in CONTRACT_ADDRESSES
}

// Get all supported chain IDs
export const SUPPORTED_CHAIN_IDS = Object.keys(CONTRACT_ADDRESSES).map(id => parseInt(id))

// Contract deployment blocks (for event filtering)
export const DEPLOYMENT_BLOCKS = {
  1: 19_000_000, // Ethereum mainnet
  42161: 170_000_000, // Arbitrum
  10: 110_000_000, // Optimism  
  137: 50_000_000, // Polygon
  11155111: 5_000_000, // Sepolia
} as const 