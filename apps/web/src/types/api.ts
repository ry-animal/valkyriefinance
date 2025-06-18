// Frontend API types matching backend types
export interface TokenAnalysis {
  symbol: string;
  token?: string; // For compatibility
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

export interface MarketAnalysisResult {
  tokenAnalysis: TokenAnalysis[];
  sentiment: {
    overall: number;
    fear_greed_index: number;
    social_mentions: number;
  };
  overallTrend: 'Bullish' | 'Bearish';
  timestamp: number;
}

export interface OptimizationResult {
  recommendations: string[];
  marketAnalysis: MarketAnalysisResult;
}

export interface RiskAssessmentData {
  warnings: string[];
  recommendations: string[];
}

// Transaction type for stores
export interface Transaction {
  hash: string;
  type: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  amount?: string;
  token?: string;
}
