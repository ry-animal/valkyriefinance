/**
 * Contract address types and configurations
 */

export type Address = `0x${string}`;

export interface ContractAddresses {
  valkyrieToken: Address;
  valkyrieVault: Address;
  valkyriePriceOracle: Address;
  valkyrieAutomation?: Address;
  valkyrieGovernance?: Address;
}

export type ContractName = keyof ContractAddresses;
export type SupportedChainId = 1 | 10 | 137 | 42161 | 11155111 | 84532 | 31337;

export interface DeploymentConfig {
  [chainId: number]: Partial<ContractAddresses>;
}
