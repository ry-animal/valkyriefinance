package models

import (
	"time"
)

// PriceData represents real-time price information
type PriceData struct {
	Symbol    string    `json:"symbol"`
	Price     float64   `json:"price"`
	Volume24h float64   `json:"volume_24h"`
	Change24h float64   `json:"change_24h"`
	MarketCap float64   `json:"market_cap"`
	Timestamp time.Time `json:"timestamp"`
	Source    string    `json:"source"`
}

// YieldData represents yield information from various protocols
type YieldData struct {
	Protocol  string    `json:"protocol"`
	Token     string    `json:"token"`
	APY       float64   `json:"apy"`
	TVL       float64   `json:"tvl"`
	Risk      float64   `json:"risk"` // 0-1 scale
	Timestamp time.Time `json:"timestamp"`
}

// PortfolioPosition represents a position in the portfolio
type PortfolioPosition struct {
	Token    string  `json:"token"`
	Amount   float64 `json:"amount"`
	Value    float64 `json:"value"`
	Weight   float64 `json:"weight"`
	YieldAPY float64 `json:"yield_apy"`
}

// Portfolio represents the current portfolio state
type Portfolio struct {
	ID          string              `json:"id"`
	TotalValue  float64             `json:"total_value"`
	Positions   []PortfolioPosition `json:"positions"`
	LastUpdated time.Time           `json:"last_updated"`
}

// RebalanceRecommendation represents AI-generated rebalancing recommendations
type RebalanceRecommendation struct {
	PortfolioID    string            `json:"portfolio_id"`
	Timestamp      time.Time         `json:"timestamp"`
	Confidence     float64           `json:"confidence"`
	ExpectedReturn float64           `json:"expected_return"`
	Risk           float64           `json:"risk"`
	Actions        []RebalanceAction `json:"actions"`
	Reasoning      string            `json:"reasoning"`
}

// RebalanceAction represents a single rebalancing action
type RebalanceAction struct {
	Type         string  `json:"type"` // "buy", "sell", "rebalance"
	Token        string  `json:"token"`
	Amount       float64 `json:"amount"`
	TargetWeight float64 `json:"target_weight"`
	Priority     int     `json:"priority"`
}

// RiskMetrics represents portfolio risk metrics
type RiskMetrics struct {
	PortfolioID string    `json:"portfolio_id"`
	VaR95       float64   `json:"var_95"`
	VaR99       float64   `json:"var_99"`
	Volatility  float64   `json:"volatility"`
	SharpeRatio float64   `json:"sharpe_ratio"`
	MaxDrawdown float64   `json:"max_drawdown"`
	Beta        float64   `json:"beta"`
	Timestamp   time.Time `json:"timestamp"`
}

// MarketAnalysis represents comprehensive market analysis
type MarketAnalysis struct {
	TokenAnalysis []TokenAnalysis `json:"token_analysis"`
	Sentiment     MarketSentiment `json:"sentiment"`
	Timestamp     time.Time       `json:"timestamp"`
}

// TokenAnalysis represents analysis for a specific token
type TokenAnalysis struct {
	Token           string  `json:"token"`
	Price           float64 `json:"price"`
	Volume24h       float64 `json:"volume_24h"`
	Change24h       float64 `json:"change_24h"`
	Volatility      float64 `json:"volatility"`
	SupportLevel    float64 `json:"support_level"`
	ResistanceLevel float64 `json:"resistance_level"`
	Trend           string  `json:"trend"`
}

// MarketSentiment represents overall market sentiment
type MarketSentiment struct {
	FearGreedIndex   float64 `json:"fear_greed_index"`
	BullishSentiment float64 `json:"bullish_sentiment"`
	BearishSentiment float64 `json:"bearish_sentiment"`
	NeutralSentiment float64 `json:"neutral_sentiment"`
}

// MarketIndicators represents key market indicators
type MarketIndicators struct {
	FearGreedIndex float64   `json:"fear_greed_index"`
	TotalMarketCap float64   `json:"total_market_cap"`
	BTCDominance   float64   `json:"btc_dominance"`
	ETHDominance   float64   `json:"eth_dominance"`
	DeFiTVL        float64   `json:"defi_tvl"`
	Volatility     float64   `json:"volatility"`
	Timestamp      time.Time `json:"timestamp"`
}
