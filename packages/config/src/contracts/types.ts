/**
 * Contract address types and configurations
 */

export interface ContractAddresses {
  valkyrieToken: string;
  valkyrieVault: string;
  valkyriePriceOracle: string;
  valkyrieAutomation?: string;
  valkyrieGovernance?: string;
}

export type ContractName = keyof ContractAddresses;
export type SupportedChainId = 1 | 10 | 137 | 42161 | 11155111 | 84532 | 31337;

export interface DeploymentConfig {
  [chainId: number]: Partial<ContractAddresses>;
}
