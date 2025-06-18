import { z } from 'zod';

// Base Schemas
export const baseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userOwnedEntitySchema = baseEntitySchema.extend({
  userId: z.string().uuid(),
});

// User Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Portfolio Schemas
export const portfolioCreateSchema = z.object({
  name: z.string().min(1, 'Portfolio name is required'),
  description: z.string().optional(),
  currency: z.string().default('USD'),
  isDefault: z.boolean().default(false),
});

export const portfolioUpdateSchema = portfolioCreateSchema.partial();

export const portfolioSchema = userOwnedEntitySchema.extend({
  name: z.string(),
  description: z.string().optional(),
  totalValue: z.string(),
  currency: z.string(),
  isDefault: z.boolean(),
});

export const portfolioAssetCreateSchema = z.object({
  portfolioId: z.string().uuid(),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  tokenSymbol: z.string().min(1),
  tokenDecimals: z.number().min(0).max(18),
  chainId: z.number().positive(),
  balance: z.string(),
  valueUsd: z.string().optional(),
});

// Transaction Schemas
export const transactionTypeSchema = z.enum([
  'swap',
  'deposit',
  'withdrawal',
  'bridge',
  'approve',
  'liquidity_add',
  'liquidity_remove',
]);

export const transactionStatusSchema = z.enum(['pending', 'confirmed', 'failed', 'cancelled']);

export const transactionCreateSchema = z.object({
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  type: transactionTypeSchema,
  status: transactionStatusSchema.default('pending'),
  chainId: z.number().positive(),
  blockNumber: z.number().positive().optional(),
  gasUsed: z.string().optional(),
  gasPrice: z.string().optional(),
  value: z.string().optional(),
  fromAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid from address'),
  toAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid to address')
    .optional(),
  tokenAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address')
    .optional(),
  tokenAmount: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Vault Operation Schemas
export const vaultOperationTypeSchema = z.enum([
  'deposit',
  'withdrawal',
  'rebalance',
  'harvest',
  'emergency_exit',
]);

export const vaultOperationCreateSchema = z.object({
  vaultAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid vault address'),
  operationType: vaultOperationTypeSchema,
  assetAmount: z.string(),
  shareAmount: z.string(),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  blockNumber: z.number().positive(),
  sharePrice: z.string().optional(),
  gasUsed: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// AI Recommendation Schemas
export const aiRecommendationCreateSchema = z.object({
  userId: z.string().uuid().optional(),
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  confidence: z.string().optional(),
  expectedReturn: z.string().optional(),
  riskLevel: z.number().min(1).max(10).optional(),
  recommendation: z.record(z.unknown()),
});

// Web3 Schemas
export const chainConfigSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  symbol: z.string().min(1),
  rpcUrl: z.string().url(),
  blockExplorer: z.string().url(),
});

export const tokenInfoSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  symbol: z.string().min(1),
  name: z.string().min(1),
  decimals: z.number().min(0).max(18),
  chainId: z.number().positive(),
});

// API Response Schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// Pagination Schemas
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    nextCursor: z.string().optional(),
    hasNextPage: z.boolean(),
  });

// Bridge Schemas
export const bridgeQuoteSchema = z.object({
  srcTokenAddress: z.string(),
  srcTokenBlockchain: z.string(),
  srcTokenAmount: z.string(),
  dstTokenAddress: z.string(),
  dstTokenBlockchain: z.string(),
  slippage: z.number().optional().default(1),
  referrer: z.string().optional().default('valkryie'),
});

export type BridgeQuoteInput = z.infer<typeof bridgeQuoteSchema>;

export const bridgeSwapSchema = bridgeQuoteSchema.extend({
  fromAddress: z.string(),
});

export type BridgeSwapInput = z.infer<typeof bridgeSwapSchema>;
