package server

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/valkryiefinance/ai-engine/internal/models"
)

// MockAIEngine implements AIEngine for testing
type MockAIEngine struct {
	rebalanceRecommendation *models.RebalanceRecommendation
	riskMetrics             *models.RiskMetrics
	marketAnalysis          *models.MarketAnalysis
	shouldError             bool
	errorMessage            string
}

func NewMockAIEngine() *MockAIEngine {
	return &MockAIEngine{
		rebalanceRecommendation: &models.RebalanceRecommendation{
			PortfolioID:    "test-portfolio",
			Timestamp:      time.Now(),
			Confidence:     0.85,
			ExpectedReturn: 0.12,
			Risk:           0.15,
			Actions: []models.RebalanceAction{
				{
					Type:         "rebalance",
					Token:        "BTC",
					Amount:       0.5,
					TargetWeight: 0.6,
					Priority:     1,
				},
			},
			Reasoning: "Portfolio optimization based on market conditions",
		},
		riskMetrics: &models.RiskMetrics{
			PortfolioID: "test-portfolio",
			VaR95:       -0.05,
			VaR99:       -0.08,
			Volatility:  0.25,
			SharpeRatio: 1.2,
			MaxDrawdown: -0.15,
			Beta:        1.1,
			Timestamp:   time.Now(),
		},
		marketAnalysis: &models.MarketAnalysis{
			TokenAnalysis: []models.TokenAnalysis{
				{
					Token:           "BTC",
					Price:           42000.0,
					Volume24h:       15000000000,
					Change24h:       2.5,
					Volatility:      0.45,
					SupportLevel:    40000.0,
					ResistanceLevel: 45000.0,
					Trend:           "bullish",
				},
			},
			Sentiment: models.MarketSentiment{
				FearGreedIndex:   72.0,
				BullishSentiment: 45.0,
				BearishSentiment: 25.0,
				NeutralSentiment: 30.0,
			},
			Timestamp: time.Now(),
		},
	}
}

func (m *MockAIEngine) GetRebalanceRecommendation(ctx context.Context, portfolio models.Portfolio) (*models.RebalanceRecommendation, error) {
	if m.shouldError {
		return nil, fmt.Errorf(m.errorMessage)
	}
	return m.rebalanceRecommendation, nil
}

func (m *MockAIEngine) CalculateRiskMetrics(ctx context.Context, portfolio models.Portfolio) (*models.RiskMetrics, error) {
	if m.shouldError {
		return nil, fmt.Errorf(m.errorMessage)
	}
	return m.riskMetrics, nil
}

func (m *MockAIEngine) GetMarketAnalysis(ctx context.Context, tokens []string, timeframe string) (*models.MarketAnalysis, error) {
	if m.shouldError {
		return nil, fmt.Errorf(m.errorMessage)
	}
	return m.marketAnalysis, nil
}

// MockMarketDataCollector implements MarketDataCollector for testing
type MockMarketDataCollector struct {
	indicators *models.MarketIndicators
	shouldError bool
	errorMessage string
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
	if m.shouldError {
		return nil, fmt.Errorf(m.errorMessage)
	}
	return m.indicators, nil
}

func (m *MockMarketDataCollector) Start() error {
	return nil
}

func (m *MockMarketDataCollector) Stop() error {
	return nil
}

// Test helper functions
func createTestServer() *SimpleHTTPServer {
	aiEngine := NewMockAIEngine()
	dataCollector := NewMockMarketDataCollector()
	return NewSimpleHTTPServer(aiEngine, dataCollector)
}

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
		},
		TotalValue:  100000.0,
		LastUpdated: time.Now(),
	}
}

// TestSimpleHTTPServer_HealthHandler tests the health endpoint
func TestSimpleHTTPServer_HealthHandler(t *testing.T) {
	server := createTestServer()

	t.Run("GET /health", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/health", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.healthHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
		}

		var response map[string]interface{}
		if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
			t.Fatalf("Failed to parse JSON response: %v", err)
		}

		if response["status"] != "healthy" {
			t.Errorf("Expected status 'healthy', got %v", response["status"])
		}

		if _, exists := response["timestamp"]; !exists {
			t.Error("Expected timestamp in response")
		}

		if _, exists := response["services"]; !exists {
			t.Error("Expected services in response")
		}
	})

	t.Run("POST /health should return 405", func(t *testing.T) {
		req, err := http.NewRequest("POST", "/health", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.healthHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusMethodNotAllowed {
			t.Errorf("Expected status code %d, got %d", http.StatusMethodNotAllowed, status)
		}
	})
}

// TestSimpleHTTPServer_MarketIndicatorsHandler tests the market indicators endpoint
func TestSimpleHTTPServer_MarketIndicatorsHandler(t *testing.T) {
	server := createTestServer()

	t.Run("GET /api/market-indicators", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/api/market-indicators", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.marketIndicatorsHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
		}

		var indicators models.MarketIndicators
		if err := json.Unmarshal(rr.Body.Bytes(), &indicators); err != nil {
			t.Fatalf("Failed to parse JSON response: %v", err)
		}

		if indicators.FearGreedIndex < 0 || indicators.FearGreedIndex > 100 {
			t.Errorf("Expected fear & greed index between 0-100, got %f", indicators.FearGreedIndex)
		}

		if indicators.TotalMarketCap <= 0 {
			t.Errorf("Expected positive total market cap, got %f", indicators.TotalMarketCap)
		}
	})
}

// TestSimpleHTTPServer_OptimizePortfolioHandler tests the portfolio optimization endpoint
func TestSimpleHTTPServer_OptimizePortfolioHandler(t *testing.T) {
	server := createTestServer()

	t.Run("POST /api/optimize-portfolio with valid portfolio", func(t *testing.T) {
		portfolio := createTestPortfolio()
		jsonData, err := json.Marshal(portfolio)
		if err != nil {
			t.Fatal(err)
		}

		req, err := http.NewRequest("POST", "/api/optimize-portfolio", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.optimizePortfolioHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
		}

		var recommendation models.RebalanceRecommendation
		if err := json.Unmarshal(rr.Body.Bytes(), &recommendation); err != nil {
			t.Fatalf("Failed to parse JSON response: %v", err)
		}

		if recommendation.Confidence < 0 || recommendation.Confidence > 1 {
			t.Errorf("Expected confidence between 0 and 1, got %f", recommendation.Confidence)
		}

		if len(recommendation.Actions) == 0 {
			t.Error("Expected at least one rebalance action")
		}
	})

	t.Run("POST /api/optimize-portfolio with invalid JSON", func(t *testing.T) {
		invalidJSON := `{"invalid": json}`

		req, err := http.NewRequest("POST", "/api/optimize-portfolio", strings.NewReader(invalidJSON))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.optimizePortfolioHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusBadRequest {
			t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, status)
		}
	})

	t.Run("POST /api/optimize-portfolio with empty portfolio ID", func(t *testing.T) {
		portfolio := createTestPortfolio()
		portfolio.ID = "" // Invalid empty ID

		jsonData, err := json.Marshal(portfolio)
		if err != nil {
			t.Fatal(err)
		}

		req, err := http.NewRequest("POST", "/api/optimize-portfolio", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.optimizePortfolioHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusBadRequest {
			t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, status)
		}
	})

	t.Run("GET /api/optimize-portfolio should return 405", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/api/optimize-portfolio", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.optimizePortfolioHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusMethodNotAllowed {
			t.Errorf("Expected status code %d, got %d", http.StatusMethodNotAllowed, status)
		}
	})
}

// TestSimpleHTTPServer_RiskMetricsHandler tests the risk metrics endpoint
func TestSimpleHTTPServer_RiskMetricsHandler(t *testing.T) {
	server := createTestServer()

	t.Run("POST /api/risk-metrics with valid portfolio", func(t *testing.T) {
		portfolio := createTestPortfolio()
		jsonData, err := json.Marshal(portfolio)
		if err != nil {
			t.Fatal(err)
		}

		req, err := http.NewRequest("POST", "/api/risk-metrics", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.riskMetricsHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
		}

		var metrics models.RiskMetrics
		if err := json.Unmarshal(rr.Body.Bytes(), &metrics); err != nil {
			t.Fatalf("Failed to parse JSON response: %v", err)
		}

		if metrics.Volatility < 0 {
			t.Errorf("Expected non-negative volatility, got %f", metrics.Volatility)
		}

		if metrics.VaR95 >= 0 {
			t.Errorf("Expected negative VaR95 (loss), got %f", metrics.VaR95)
		}
	})
}

// TestSimpleHTTPServer_MarketAnalysisHandler tests the market analysis endpoint
func TestSimpleHTTPServer_MarketAnalysisHandler(t *testing.T) {
	server := createTestServer()

	t.Run("POST /api/market-analysis with valid request", func(t *testing.T) {
		request := map[string]interface{}{
			"tokens":    []string{"BTC", "ETH"},
			"timeframe": "1d",
		}

		jsonData, err := json.Marshal(request)
		if err != nil {
			t.Fatal(err)
		}

		req, err := http.NewRequest("POST", "/api/market-analysis", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.marketAnalysisHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
		}

		var analysis models.MarketAnalysis
		if err := json.Unmarshal(rr.Body.Bytes(), &analysis); err != nil {
			t.Fatalf("Failed to parse JSON response: %v", err)
		}

		if len(analysis.TokenAnalysis) == 0 {
			t.Error("Expected at least one token analysis")
		}
	})

	t.Run("POST /api/market-analysis with empty tokens", func(t *testing.T) {
		request := map[string]interface{}{
			"tokens":    []string{},
			"timeframe": "1d",
		}

		jsonData, err := json.Marshal(request)
		if err != nil {
			t.Fatal(err)
		}

		req, err := http.NewRequest("POST", "/api/market-analysis", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.marketAnalysisHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusBadRequest {
			t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, status)
		}
	})
}

// TestSimpleHTTPServer_Middleware tests the middleware functionality
func TestSimpleHTTPServer_Middleware(t *testing.T) {
	server := createTestServer()

	t.Run("CORS headers", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/health", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.healthHandler)
		handler.ServeHTTP(rr, req)

		expectedHeaders := map[string]string{
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			"X-Content-Type-Options":       "nosniff",
			"X-Frame-Options":              "DENY",
			"X-XSS-Protection":             "1; mode=block",
		}

		for header, expectedValue := range expectedHeaders {
			if value := rr.Header().Get(header); value != expectedValue {
				t.Errorf("Expected header %s: %s, got: %s", header, expectedValue, value)
			}
		}
	})

	t.Run("OPTIONS request", func(t *testing.T) {
		req, err := http.NewRequest("OPTIONS", "/health", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.healthHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Expected status code %d for OPTIONS request, got %d", http.StatusOK, status)
		}
	})
}

// TestSimpleHTTPServer_ErrorHandling tests error handling scenarios
func TestSimpleHTTPServer_ErrorHandling(t *testing.T) {
	// Create server with mock that returns errors
	aiEngine := NewMockAIEngine()
	aiEngine.shouldError = true
	aiEngine.errorMessage = "mock error"

	dataCollector := NewMockMarketDataCollector()
	dataCollector.shouldError = true
	dataCollector.errorMessage = "data collector error"

	server := NewSimpleHTTPServer(aiEngine, dataCollector)

	t.Run("AI engine error in portfolio optimization", func(t *testing.T) {
		portfolio := createTestPortfolio()
		jsonData, err := json.Marshal(portfolio)
		if err != nil {
			t.Fatal(err)
		}

		req, err := http.NewRequest("POST", "/api/optimize-portfolio", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatal(err)
		}
		req.Header.Set("Content-Type", "application/json")

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.optimizePortfolioHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusInternalServerError {
			t.Errorf("Expected status code %d, got %d", http.StatusInternalServerError, status)
		}
	})

	t.Run("Data collector error in market indicators", func(t *testing.T) {
		req, err := http.NewRequest("GET", "/api/market-indicators", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
		handler := server.withMiddleware(server.marketIndicatorsHandler)
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != http.StatusInternalServerError {
			t.Errorf("Expected status code %d, got %d", http.StatusInternalServerError, status)
		}
	})
}

// BenchmarkSimpleHTTPServer_HealthHandler benchmarks the health endpoint
func BenchmarkSimpleHTTPServer_HealthHandler(b *testing.B) {
	server := createTestServer()
	handler := server.withMiddleware(server.healthHandler)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req, _ := http.NewRequest("GET", "/health", nil)
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
	}
}
