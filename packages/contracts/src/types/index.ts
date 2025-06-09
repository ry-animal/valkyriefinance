import type { Address } from 'viem'

// Vault operations
export interface VaultOperation {
  type: 'deposit' | 'withdraw' | 'mint' | 'redeem'
  assets: bigint
  shares: bigint
  receiver: Address
  owner?: Address
  txHash: string
  blockNumber: bigint
  timestamp: number
}

// Token staking
export interface StakeInfo {
  user: Address
  stakedAmount: bigint
  pendingRewards: bigint
  lastUpdate: number
}

// Governance proposal
export interface Proposal {
  id: bigint
  proposer: Address
  targets: Address[]
  values: bigint[]
  calldatas: string[]
  description: string
  startBlock: bigint
  endBlock: bigint
  forVotes: bigint
  againstVotes: bigint
  abstainVotes: bigint
  state: ProposalState
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

// Vault strategy info
export interface VaultStrategy {
  name: string
  allocation: number // Percentage (0-100)
  targetApy: number
  currentApy: number
  totalAssets: bigint
  riskLevel: 'low' | 'medium' | 'high'
  isActive: boolean
}

// Cross-chain operation
export interface CrossChainOperation {
  sourceChain: number
  targetChain: number
  sourceToken: Address
  targetToken: Address
  amount: bigint
  bridgeProvider: string
  status: 'pending' | 'bridging' | 'completed' | 'failed'
  txHashes: {
    source?: string
    bridge?: string
    target?: string
  }
  estimatedTime: number
  fees: bigint
}

// Vault performance metrics
export interface VaultMetrics {
  totalAssets: bigint
  totalShares: bigint
  sharePrice: bigint // In underlying asset units
  apy: number
  totalYieldGenerated: bigint
  lastUpdate: number
  strategies: VaultStrategy[]
}

// Platform metrics
export interface PlatformMetrics {
  totalValueLocked: bigint
  totalUsers: number
  totalTransactions: number
  averageApy: number
  topPerformingStrategy: string
}

// Transaction types for the platform
export type TransactionType = 
  | 'vault_deposit'
  | 'vault_withdraw'
  | 'token_stake'
  | 'token_unstake'
  | 'token_claim'
  | 'governance_vote'
  | 'governance_propose'
  | 'cross_chain_swap'

export interface PlatformTransaction {
  hash: string
  type: TransactionType
  user: Address
  amount?: bigint
  token?: Address
  chainId: number
  blockNumber: bigint
  timestamp: number
  gasUsed: bigint
  gasPrice: bigint
  status: 'pending' | 'success' | 'failed'
  metadata?: Record<string, any>
} 