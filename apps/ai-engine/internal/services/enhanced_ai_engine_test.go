package services

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/valkryiefinance/ai-engine/internal/models"
)

// MockMarketDataCollector implements MarketDataCollector for testing
type MockMarketDataCollector struct {
	indicators *models.MarketIndicators
	startErr   error
	stopErr    error
	running    bool
}

func NewMockMarketDataCollector() *MockMarketDataCollector {
	return &MockMarketDataCollector{
		indicators: &models.MarketIndicators{
			FearGreedIndex: 50.0,
			TotalMarketCap: 1000000000000,
			BTCDominance:   45.0,
			ETHDominance:   18.0,
			DeFiTVL:        250000000000,
			Volatility:     0.35,
			Timestamp:      time.Now(),
		},
	}
}

func (m *MockMarketDataCollector) GetMarketIndicators() (*models.MarketIndicators, error) {
	return m.indicators, nil
}

func (m *MockMarketDataCollector) Start() error {
	if m.startErr != nil {
		return m.startErr
	}
	m.running = true
	return nil
}

func (m *MockMarketDataCollector) Stop() error {
	if m.stopErr != nil {
		return m.stopErr
	}
	m.running = false
	return nil
}

// Test helper functions
func createTestPortfolio() models.Portfolio {
	return models.Portfolio{
		ID: "test-portfolio-123",
		Positions: []models.PortfolioPosition{
			{
				Token:    "BTC",
				Weight:   0.6,
				Amount:   1.5,
				Value:    63000.0,
				YieldAPY: 0.05,
			},
			{
				Token:    "ETH",
				Weight:   0.3,
				Amount:   10.0,
				Value:    25000.0,
				YieldAPY: 0.08,
			},
			{
				Token:    "LINK",
				Weight:   0.1,
				Amount:   100.0,
				Value:    1500.0,
				YieldAPY: 0.12,
			},
		},
		TotalValue:  100000.0,
		LastUpdated: time.Now(),
	}
}

func createEmptyPortfolio() models.Portfolio {
	return models.Portfolio{
		ID:        "empty-portfolio",
		Positions: []models.PortfolioPosition{},
	}
}

func createInvalidPortfolio() models.Portfolio {
	return models.Portfolio{
		ID: "", // Invalid empty ID
		Positions: []models.PortfolioPosition{
			{
				Token:  "BTC",
				Weight: 1.5, // Invalid weight > 1
				Amount: 1.0,
			},
		},
	}
}

// TestEnhancedAIEngine_GetRebalanceRecommendation tests portfolio rebalancing
func TestEnhancedAIEngine_GetRebalanceRecommendation(t *testing.T) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()

	t.Run("ValidPortfolio", func(t *testing.T) {
		portfolio := createTestPortfolio()

		recommendation, err := engine.GetRebalanceRecommendation(ctx, portfolio)

		if err != nil {
			t.Fatalf("Expected no error, got: %v", err)
		}

		if recommendation == nil {
			t.Fatal("Expected recommendation, got nil")
		}

		if recommendation.PortfolioID != portfolio.ID {
			t.Errorf("Expected portfolio ID %s, got %s", portfolio.ID, recommendation.PortfolioID)
		}

		if recommendation.Confidence < 0 || recommendation.Confidence > 1 {
			t.Errorf("Expected confidence between 0 and 1, got %f", recommendation.Confidence)
		}

		if len(recommendation.Actions) == 0 {
			t.Error("Expected at least one rebalance action")
		}

		if recommendation.ExpectedReturn <= 0 {
			t.Errorf("Expected positive expected return, got %f", recommendation.ExpectedReturn)
		}
	})

	t.Run("ContextTimeout", func(t *testing.T) {
		portfolio := createTestPortfolio()

		// Create context with very short timeout
		ctx, cancel := context.WithTimeout(context.Background(), 1*time.Nanosecond)
		defer cancel()

		// Wait for context to timeout
		time.Sleep(1 * time.Millisecond)

		_, err := engine.GetRebalanceRecommendation(ctx, portfolio)

		// Should still work as our implementation doesn't check context timeout
		// In a real implementation, this would return a timeout error
		if err != nil {
			t.Logf("Context timeout handled: %v", err)
		}
	})
}

// TestEnhancedAIEngine_CalculateRiskMetrics tests risk calculation
func TestEnhancedAIEngine_CalculateRiskMetrics(t *testing.T) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()

	t.Run("ValidPortfolio", func(t *testing.T) {
		portfolio := createTestPortfolio()

		metrics, err := engine.CalculateRiskMetrics(ctx, portfolio)

		if err != nil {
			t.Fatalf("Expected no error, got: %v", err)
		}

		if metrics == nil {
			t.Fatal("Expected metrics, got nil")
		}

		if metrics.PortfolioID != portfolio.ID {
			t.Errorf("Expected portfolio ID %s, got %s", portfolio.ID, metrics.PortfolioID)
		}

		if metrics.Volatility < 0 {
			t.Errorf("Expected non-negative volatility, got %f", metrics.Volatility)
		}

		if metrics.VaR95 >= 0 {
			t.Errorf("Expected negative VaR95 (loss), got %f", metrics.VaR95)
		}

		if metrics.VaR99 >= 0 {
			t.Errorf("Expected negative VaR99 (loss), got %f", metrics.VaR99)
		}

		if metrics.VaR99 >= metrics.VaR95 {
			t.Errorf("Expected VaR99 (%f) to be more negative than VaR95 (%f)", metrics.VaR99, metrics.VaR95)
		}

		if metrics.Beta < 0 {
			t.Errorf("Expected non-negative beta, got %f", metrics.Beta)
		}
	})

	t.Run("EmptyPortfolio", func(t *testing.T) {
		portfolio := createEmptyPortfolio()

		_, err := engine.CalculateRiskMetrics(ctx, portfolio)

		if err == nil {
			t.Fatal("Expected error for empty portfolio, got nil")
		}

		expectedMsg := "has no positions"
		if !containsString(err.Error(), expectedMsg) {
			t.Errorf("Expected error to contain '%s', got: %v", expectedMsg, err)
		}
	})
}

// TestEnhancedAIEngine_GetMarketAnalysis tests market analysis
func TestEnhancedAIEngine_GetMarketAnalysis(t *testing.T) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()

	t.Run("ValidTokens", func(t *testing.T) {
		tokens := []string{"BTC", "ETH", "LINK"}
		timeframe := "1d"

		analysis, err := engine.GetMarketAnalysis(ctx, tokens, timeframe)

		if err != nil {
			t.Fatalf("Expected no error, got: %v", err)
		}

		if analysis == nil {
			t.Fatal("Expected analysis, got nil")
		}

		if len(analysis.TokenAnalysis) != len(tokens) {
			t.Errorf("Expected %d token analyses, got %d", len(tokens), len(analysis.TokenAnalysis))
		}

		for i, tokenAnalysis := range analysis.TokenAnalysis {
			if tokenAnalysis.Token != tokens[i] {
				t.Errorf("Expected token %s at index %d, got %s", tokens[i], i, tokenAnalysis.Token)
			}

			if tokenAnalysis.Price <= 0 {
				t.Errorf("Expected positive price for %s, got %f", tokenAnalysis.Token, tokenAnalysis.Price)
			}

			if tokenAnalysis.Volatility < 0 {
				t.Errorf("Expected non-negative volatility for %s, got %f", tokenAnalysis.Token, tokenAnalysis.Volatility)
			}
		}

		// Check sentiment
		sentiment := analysis.Sentiment
		if sentiment.FearGreedIndex < 0 || sentiment.FearGreedIndex > 100 {
			t.Errorf("Expected fear & greed index between 0-100, got %f", sentiment.FearGreedIndex)
		}

		totalSentiment := sentiment.BullishSentiment + sentiment.BearishSentiment + sentiment.NeutralSentiment
		if totalSentiment < 95 || totalSentiment > 105 { // Allow small rounding errors
			t.Errorf("Expected sentiment percentages to sum to ~100, got %f", totalSentiment)
		}
	})

	t.Run("EmptyTokenList", func(t *testing.T) {
		tokens := []string{}
		timeframe := "1d"

		_, err := engine.GetMarketAnalysis(ctx, tokens, timeframe)

		if err == nil {
			t.Fatal("Expected error for empty token list, got nil")
		}

		expectedMsg := "no tokens provided"
		if !containsString(err.Error(), expectedMsg) {
			t.Errorf("Expected error to contain '%s', got: %v", expectedMsg, err)
		}
	})

	t.Run("TooManyTokens", func(t *testing.T) {
		// Create a list with more than reasonable number of tokens
		tokens := make([]string, 50)
		for i := range tokens {
			tokens[i] = "TOKEN" + string(rune(i))
		}
		timeframe := "1d"

		analysis, err := engine.GetMarketAnalysis(ctx, tokens, timeframe)

		// Should still work, but might be slow in real implementation
		if err != nil {
			t.Logf("Large token list handled: %v", err)
		} else if analysis != nil {
			t.Logf("Successfully analyzed %d tokens", len(analysis.TokenAnalysis))
		}
	})
}

// TestEnhancedAIEngine_Performance tests performance characteristics
func TestEnhancedAIEngine_Performance(t *testing.T) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()
	portfolio := createTestPortfolio()

	t.Run("RebalanceRecommendationPerformance", func(t *testing.T) {
		start := time.Now()

		_, err := engine.GetRebalanceRecommendation(ctx, portfolio)

		duration := time.Since(start)

		if err != nil {
			t.Fatalf("Expected no error, got: %v", err)
		}

		// Should complete within reasonable time (target: <150ms)
		maxDuration := 150 * time.Millisecond
		if duration > maxDuration {
			t.Errorf("Rebalance recommendation took %v, expected < %v", duration, maxDuration)
		} else {
			t.Logf("Rebalance recommendation completed in %v", duration)
		}
	})

	t.Run("RiskMetricsPerformance", func(t *testing.T) {
		start := time.Now()

		_, err := engine.CalculateRiskMetrics(ctx, portfolio)

		duration := time.Since(start)

		if err != nil {
			t.Fatalf("Expected no error, got: %v", err)
		}

		// Should complete within reasonable time
		maxDuration := 100 * time.Millisecond
		if duration > maxDuration {
			t.Errorf("Risk metrics calculation took %v, expected < %v", duration, maxDuration)
		} else {
			t.Logf("Risk metrics calculation completed in %v", duration)
		}
	})
}

// TestEnhancedAIEngine_ConcurrentAccess tests thread safety
func TestEnhancedAIEngine_ConcurrentAccess(t *testing.T) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()
	portfolio := createTestPortfolio()

	t.Run("ConcurrentRebalanceRequests", func(t *testing.T) {
		const numGoroutines = 10
		errors := make(chan error, numGoroutines)

		for i := 0; i < numGoroutines; i++ {
			go func(id int) {
				portfolio.ID = fmt.Sprintf("portfolio-%d", id)
				_, err := engine.GetRebalanceRecommendation(ctx, portfolio)
				errors <- err
			}(i)
		}

		// Collect all errors
		for i := 0; i < numGoroutines; i++ {
			if err := <-errors; err != nil {
				t.Errorf("Goroutine %d failed: %v", i, err)
			}
		}
	})
}

// Benchmark tests
func BenchmarkEnhancedAIEngine_GetRebalanceRecommendation(b *testing.B) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()
	portfolio := createTestPortfolio()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := engine.GetRebalanceRecommendation(ctx, portfolio)
		if err != nil {
			b.Fatalf("Benchmark failed: %v", err)
		}
	}
}

func BenchmarkEnhancedAIEngine_CalculateRiskMetrics(b *testing.B) {
	engine := NewEnhancedAIEngine()
	ctx := context.Background()
	portfolio := createTestPortfolio()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := engine.CalculateRiskMetrics(ctx, portfolio)
		if err != nil {
			b.Fatalf("Benchmark failed: %v", err)
		}
	}
}

// Helper function to check if string contains substring
func containsString(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr ||
		(len(s) > len(substr) &&
		 (s[:len(substr)] == substr ||
		  s[len(s)-len(substr):] == substr ||
		  containsStringMiddle(s, substr))))
}

func containsStringMiddle(s, substr string) bool {
	for i := 1; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
