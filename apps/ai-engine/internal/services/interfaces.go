package services

import (
	"context"

	"github.com/valkyriefinance/ai-engine/internal/models"
)

// AIEngine defines the interface for AI-powered portfolio analysis
type AIEngine interface {
	// GetRebalanceRecommendation provides intelligent portfolio rebalancing recommendations
	GetRebalanceRecommendation(ctx context.Context, portfolio models.Portfolio) (*models.RebalanceRecommendation, error)

	// CalculateRiskMetrics provides sophisticated risk analysis for a portfolio
	CalculateRiskMetrics(ctx context.Context, portfolio models.Portfolio) (*models.RiskMetrics, error)

	// GetMarketAnalysis provides enhanced market analysis for specified tokens
	GetMarketAnalysis(ctx context.Context, tokens []string, timeframe string) (*models.MarketAnalysis, error)
}

// MarketDataCollector defines the interface for market data collection
type MarketDataCollector interface {
	// GetMarketIndicators returns current market indicators
	GetMarketIndicators() (*models.MarketIndicators, error)

	// Start begins the data collection process
	Start() error

	// Stop stops the data collection process
	Stop() error
}

// PortfolioValidator defines the interface for portfolio validation
type PortfolioValidator interface {
	// ValidatePortfolio validates portfolio data and returns validation errors
	ValidatePortfolio(portfolio models.Portfolio) error
}

// MarketDataProvider defines the interface for market data provision
type MarketDataProvider interface {
	// GetTokenPrice returns the current price for a token
	GetTokenPrice(token string) (float64, error)

	// GetTokenVolatility returns the volatility for a token
	GetTokenVolatility(token string) (float64, error)

	// GetTokenBeta returns the beta coefficient for a token
	GetTokenBeta(token string) (float64, error)
}

// Ensure our concrete types implement the interfaces
var (
	_ AIEngine            = (*EnhancedAIEngine)(nil)
	_ MarketDataCollector = (*RealDataCollector)(nil)
)
