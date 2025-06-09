// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Database Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOwnedEntity extends BaseEntity {
  userId: string;
}

// Portfolio Types
export interface Portfolio extends UserOwnedEntity {
  name: string;
  description?: string;
  totalValue: string;
  currency: string;
  isDefault: boolean;
}

export interface PortfolioAsset extends BaseEntity {
  portfolioId: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  chainId: number;
  balance: string;
  valueUsd?: string;
  lastUpdated: Date;
}

// Transaction Types
export type TransactionType = 
  | 'swap' 
  | 'deposit' 
  | 'withdrawal' 
  | 'bridge' 
  | 'approve' 
  | 'liquidity_add' 
  | 'liquidity_remove';

export type TransactionStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'failed' 
  | 'cancelled';

export interface Transaction extends UserOwnedEntity {
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  chainId: number;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  value?: string;
  fromAddress: string;
  toAddress?: string;
  tokenAddress?: string;
  tokenAmount?: string;
  metadata?: Record<string, unknown>;
}

// Vault Types
export type VaultOperationType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'rebalance' 
  | 'harvest' 
  | 'emergency_exit';

export interface VaultOperation extends UserOwnedEntity {
  vaultAddress: string;
  operationType: VaultOperationType;
  assetAmount: string;
  shareAmount: string;
  transactionHash: string;
  blockNumber: number;
  sharePrice?: string;
  gasUsed?: string;
  metadata?: Record<string, unknown>;
}

// AI Types
export interface AIRecommendation extends BaseEntity {
  userId?: string;
  type: string;
  title: string;
  description: string;
  confidence?: string;
  expectedReturn?: string;
  riskLevel?: number;
  recommendation: Record<string, unknown>;
  isExecuted: boolean;
  executedAt?: Date;
  executionResult?: Record<string, unknown>;
}

// Web3 Types
export interface ChainConfig {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  validation?: ValidationError[];
} 