// API Response Types for AI Engine Integration

export interface AIEnginePortfolio {
  assets: Array<{
    symbol: string;
    address: string;
    balance: number;
    value: number;
    weight: number;
  }>;
  totalValue: number;
  chainId: number;
}

export interface OptimizationAction {
  type: 'buy' | 'sell' | 'hold';
  token: string;
  target_weight: number;
  current_weight: number;
  amount?: number;
  reason: string;
}

export interface PortfolioOptimization {
  status: 'success' | 'error';
  actions: OptimizationAction[];
  expected_return: number;
  risk_score: number;
  diversification_score: number;
  recommendations: string[];
}

export interface RiskMetrics {
  overall_risk: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  correlation_risk: number;
  concentration_risk: number;
  risk_factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface TokenAnalysis {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  technical_indicators: {
    rsi: number;
    macd: number;
    moving_avg_20: number;
    moving_avg_50: number;
  };
  sentiment_score: number;
  recommendation: 'buy' | 'sell' | 'hold';
}

export interface MarketAnalysis {
  timestamp: number;
  token_analysis: TokenAnalysis[];
  sentiment: {
    overall: number;
    fear_greed_index: number;
    social_mentions: number;
  };
  market_conditions: {
    trend: 'bull' | 'bear' | 'sideways';
    volatility: 'low' | 'medium' | 'high';
    liquidity: number;
  };
}

export interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export interface MarketIndicators {
  indicators: MarketIndicator[];
  overall_sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  last_updated: number;
}

export interface AIEngineHealthResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  uptime: number;
  services: {
    portfolio_optimizer: boolean;
    risk_analyzer: boolean;
    market_analyzer: boolean;
  };
}

// Bridge API Types
export interface RubicQuoteRequest {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  fromChainId: number;
  toChainId: number;
}

export interface RubicQuoteResponse {
  id: string;
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  fee: string;
  estimatedTime: number;
  priceImpact: number;
}

export interface RubicSwapResponse {
  transactionRequest: {
    to: string;
    data: string;
    value: string;
    gasLimit: string;
  };
  trade: RubicQuoteResponse;
}

export interface RubicErrorResponse {
  message: string;
  code: string;
  details?: string;
}

// Error handling types
export interface APIErrorContext {
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  requestId?: string;
  errorType?: string;
  [key: string]: unknown; // Allow additional properties for logger compatibility
}

export interface TRPCErrorContext extends APIErrorContext {
  procedure?: string;
  input?: Record<string, unknown>;
}
