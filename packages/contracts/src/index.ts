// ABIs
export { ERC4626_VAULT_ABI } from './abis/erc4626-vault'
export { VALKYRIE_TOKEN_ABI } from './abis/valkyrie-token'

// Contract addresses
export {
  CONTRACT_ADDRESSES,
  getContractAddress,
  isSupportedChain,
  SUPPORTED_CHAIN_IDS,
  DEPLOYMENT_BLOCKS,
  type ContractName,
  type SupportedChainId,
} from './addresses'

// Types
export type {
  VaultOperation,
  StakeInfo,
  Proposal,
  VaultStrategy,
  CrossChainOperation,
  VaultMetrics,
  PlatformMetrics,
  PlatformTransaction,
  TransactionType,
} from './types'

export { ProposalState } from './types' 