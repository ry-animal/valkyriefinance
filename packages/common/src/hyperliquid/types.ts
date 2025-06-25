/**
 * HyperLiquid API types
 * Based on HyperLiquid best practices documentation
 */

import { z } from 'zod';

// Market data types
export const MarketDataSchema = z.object({
  coin: z.string(),
  side: z.enum(['A', 'B']), // Ask/Bid
  px: z.string(), // Price
  sz: z.string(), // Size
  time: z.number(),
});

export const OrderBookSchema = z.object({
  coin: z.string(),
  levels: z.array(
    z.array(
      z.object({
        px: z.string(),
        sz: z.string(),
      })
    )
  ),
  time: z.number(),
});

// Order types following HyperLiquid specification
export const OrderTypeSchema = z.enum([
  'market',
  'limit',
  'stop-market',
  'stop-limit',
  'take-profit',
  'reduce-only',
  'twap',
  'scale',
]);

export const OrderSideSchema = z.enum(['B', 'S']); // Buy/Sell

export const OrderSchema = z.object({
  coin: z.string(),
  is_buy: z.boolean(),
  sz: z.string(), // Size
  limit_px: z.string().optional(), // Limit price
  order_type: OrderTypeSchema,
  reduce_only: z.boolean().optional(),
  cloid: z.string().optional(), // Client order ID
});

// Account and position types
export const PositionSchema = z.object({
  coin: z.string(),
  szi: z.string(), // Position size
  entryPx: z.string(), // Entry price
  positionValue: z.string(),
  unrealizedPnl: z.string(),
  leverage: z.object({
    type: z.enum(['cross', 'isolated']),
    value: z.number(),
  }),
});

export const AccountStateSchema = z.object({
  marginSummary: z.object({
    accountValue: z.string(),
    totalNtlPos: z.string(), // Total notional position
    totalRawUsd: z.string(), // Total raw USD
    totalMarginUsed: z.string(),
  }),
  crossMaintenanceMarginUsed: z.string(),
  crossMarginSummary: z.object({
    accountValue: z.string(),
    totalNtlPos: z.string(),
    totalRawUsd: z.string(),
    totalMarginUsed: z.string(),
  }),
  time: z.number(),
});

// WebSocket subscription types
export const WSSubscriptionSchema = z.object({
  method: z.enum(['subscribe', 'unsubscribe']),
  subscription: z.object({
    type: z.enum([
      'allMids',
      'l2Book',
      'trades',
      'orderUpdates',
      'userFills',
      'userFundings',
      'candle',
      'webData2',
    ]),
    coin: z.string().optional(),
    user: z.string().optional(),
  }),
});

// Rate limiting configuration
export interface RateLimitConfig {
  maxRequests: number; // 100 per bucket
  refillRate: number; // 10 requests per second
  bucketSize: number; // 100
}

// API wallet configuration
export interface APIWalletConfig {
  name: string;
  mainWallet: string; // Main wallet address
  apiWallet: string; // Generated API wallet address
  privateKey: string; // API wallet private key
  permissions: string[];
  expiryTime?: number;
}

// Risk management types
export const LeverageSchema = z.object({
  coin: z.string(),
  leverage: z.number().min(1).max(50),
  is_cross: z.boolean(),
});

export const MarginModeSchema = z.enum(['cross', 'isolated']);

// Vault types for copy trading
export const VaultSchema = z.object({
  vaultAddress: z.string(),
  leader: z.string(),
  totalNlv: z.string(), // Net liquidation value
  pnl: z.object({
    day: z.string(),
    week: z.string(),
    month: z.string(),
    allTime: z.string(),
  }),
  apr: z.string(),
  maxDrawdown: z.string(),
  capacity: z.string(),
  minDeposit: z.string(),
});

// Export inferred types
export type MarketData = z.infer<typeof MarketDataSchema>;
export type OrderBook = z.infer<typeof OrderBookSchema>;
export type OrderType = z.infer<typeof OrderTypeSchema>;
export type OrderSide = z.infer<typeof OrderSideSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type AccountState = z.infer<typeof AccountStateSchema>;
export type WSSubscription = z.infer<typeof WSSubscriptionSchema>;
export type Leverage = z.infer<typeof LeverageSchema>;
export type MarginMode = z.infer<typeof MarginModeSchema>;
export type Vault = z.infer<typeof VaultSchema>;

// Error types
export class HyperLiquidAPIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'HyperLiquidAPIError';
  }
}

export class RateLimitError extends HyperLiquidAPIError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}
