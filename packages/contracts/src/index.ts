// ABIs
export { ERC4626_VAULT_ABI } from './abis/erc4626-vault';
export { VALKYRIE_TOKEN_ABI } from './abis/valkyrie-token';

// Contract addresses
export {
  CONTRACT_ADDRESSES,
  type ContractName,
  DEPLOYMENT_BLOCKS,
  getContractAddress,
  isSupportedChain,
  SUPPORTED_CHAIN_IDS,
  type SupportedChainId,
} from './addresses';

// Types
export type {
  CrossChainOperation,
  PlatformMetrics,
  PlatformTransaction,
  Proposal,
  StakeInfo,
  TransactionType,
  VaultMetrics,
  VaultOperation,
  VaultStrategy,
} from './types';

export { ProposalState } from './types';
