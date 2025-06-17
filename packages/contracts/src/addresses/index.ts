// Contract addresses by chain ID
export const CONTRACT_ADDRESSES = {
  // Ethereum Mainnet (1)
  1: {
    valkyrieToken: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as `0x${string}`,
    valkyrieVault: '0x31E606C53ed1d96fD2e7a1BE5e76a8A63b3a1E2b' as `0x${string}`,
    uniswapV4PoolManager: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24' as `0x${string}`,
    governance: '0x8BAF0C3a4E4D6C8A3C2DdB8F8f8a3B3c5d8e7f10' as `0x${string}`,
    valkyrieStrategy: '0x...' as `0x${string}`,
  },
  // Arbitrum (42161)
  42161: {
    valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
    valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    valkyrieStrategy: '0x...' as `0x${string}`,
  },
  // Optimism (10)
  10: {
    valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
    valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    valkyrieStrategy: '0x...' as `0x${string}`,
  },
  // Polygon (137)
  137: {
    valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
    valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    valkyrieStrategy: '0x...' as `0x${string}`,
  },
  // Sepolia Testnet (11155111)
  11155111: {
    valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
    valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    valkyrieStrategy: '0x...' as `0x${string}`,
  },
  // Base Sepolia Testnet (84532)
  84532: {
    valkyrieToken: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    valkyrieVault: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    valkyrieStrategy: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    mockUSDC: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  // Local Anvil Network (31337)
  31337: {
    valkyrieToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
    valkyrieVault: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
    uniswapV4PoolManager: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    governance: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    mockUSDC: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
    valkyrieStrategy: '0x...' as `0x${string}`,
  },
} as const

export type ContractName = 'valkyrieToken' | 'valkyrieVault' | 'uniswapV4PoolManager' | 'governance' | 'valkyrieStrategy'
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
  84532: 1_000_000, // Base Sepolia
} as const 