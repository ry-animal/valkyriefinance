package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/valkyriefinance/ai-engine/internal/models"
)

// DataCollector handles real-time market data collection from multiple sources
type DataCollector struct {
	priceFeeds  map[string]chan models.PriceData
	yieldFeeds  map[string]chan models.YieldData
	subscribers map[string][]chan models.PriceData
	mu          sync.RWMutex
	httpClient  *http.Client
	ctx         context.Context
	cancel      context.CancelFunc
}

// CoinGeckoResponse represents the response from CoinGecko API
type CoinGeckoResponse struct {
	Prices     [][]float64 `json:"prices"`
	MarketCaps [][]float64 `json:"market_caps"`
	TotalVols  [][]float64 `json:"total_volumes"`
}

// DeFiLlamaResponse represents the response from DeFiLlama API
type DeFiLlamaResponse struct {
	Data []struct {
		Pool    string  `json:"pool"`
		Chain   string  `json:"chain"`
		Project string  `json:"project"`
		Symbol  string  `json:"symbol"`
		APY     float64 `json:"apy"`
		TVL     float64 `json:"tvlUsd"`
	} `json:"data"`
}

// NewDataCollector creates a new data collector instance
func NewDataCollector() *DataCollector {
	ctx, cancel := context.WithCancel(context.Background())

	return &DataCollector{
		priceFeeds:  make(map[string]chan models.PriceData),
		yieldFeeds:  make(map[string]chan models.YieldData),
		subscribers: make(map[string][]chan models.PriceData),
		httpClient:  &http.Client{Timeout: 30 * time.Second},
		ctx:         ctx,
		cancel:      cancel,
	}
}

// Start begins the data collection processes
func (dc *DataCollector) Start() error {
	log.Println("Starting data collector...")

	// Start price data collection for major tokens
	tokens := []string{"ethereum", "bitcoin", "chainlink", "uniswap"}
	for _, token := range tokens {
		go dc.collectPriceData(token)
	}

	// Start yield data collection
	go dc.collectYieldData()

	// Start market indicators collection
	go dc.collectMarketIndicators()

	return nil
}

// Stop stops the data collection
func (dc *DataCollector) Stop() error {
	log.Println("Stopping data collector...")
	dc.cancel()
	return nil
}

// GetMarketIndicators returns current market indicators
func (dc *DataCollector) GetMarketIndicators() (*models.MarketIndicators, error) {
	// Return placeholder market indicators
	return &models.MarketIndicators{
		FearGreedIndex: 50.0,
		TotalMarketCap: 1.5e12, // 1.5T
		BTCDominance:   45.0,
		ETHDominance:   18.5,
		DeFiTVL:        50e9, // 50B
		Volatility:     0.25,
		Timestamp:      time.Now(),
	}, nil
}

// Subscribe subscribes to price updates for a token
func (dc *DataCollector) Subscribe(token string) chan models.PriceData {
	dc.mu.Lock()
	defer dc.mu.Unlock()

	// Create a new subscriber channel
	ch := make(chan models.PriceData, 10)

	if dc.subscribers[token] == nil {
		dc.subscribers[token] = make([]chan models.PriceData, 0)
	}

	dc.subscribers[token] = append(dc.subscribers[token], ch)
	return ch
}

// GetLatestPrice returns the latest price for a token (mock implementation)
func (dc *DataCollector) GetLatestPrice(token string) (*models.PriceData, error) {
	// Return mock data to avoid API parsing issues
	// TODO: Fix CoinGecko API parsing
	priceData := &models.PriceData{
		Symbol:    token,
		Price:     2000.0, // Mock price
		Volume24h: 1000000.0,
		Change24h: 0.05,          // 5% change
		MarketCap: 50000000000.0, // 50B market cap
		Timestamp: time.Now(),
		Source:    "mock",
	}

	return priceData, nil
}

// GetYieldData fetches yield data from DeFiLlama
func (dc *DataCollector) GetYieldData() ([]models.YieldData, error) {
	url := "https://yields.llama.fi/pools"

	resp, err := dc.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch yield data: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var result DeFiLlamaResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	var yieldData []models.YieldData
	for _, pool := range result.Data {
		// Filter for relevant protocols and minimum TVL
		if pool.TVL > 1000000 && pool.APY > 0 { // Min $1M TVL
			yieldData = append(yieldData, models.YieldData{
				Protocol:  pool.Project,
				Token:     pool.Symbol,
				APY:       pool.APY / 100, // Convert percentage to decimal
				TVL:       pool.TVL,
				Risk:      dc.calculateRiskScore(pool.Project, pool.TVL),
				Timestamp: time.Now(),
			})
		}
	}

	return yieldData, nil
}

// collectPriceData continuously collects price data for a specific token
func (dc *DataCollector) collectPriceData(token string) {
	ticker := time.NewTicker(5 * time.Second) // Update every 5 seconds
	defer ticker.Stop()

	for {
		select {
		case <-dc.ctx.Done():
			return
		case <-ticker.C:
			priceData, err := dc.GetLatestPrice(token)
			if err != nil {
				log.Printf("Error fetching price data for %s: %v", token, err)
				continue
			}

			// Broadcast to subscribers
			dc.broadcastPriceData(token, *priceData)
		}
	}
}

// collectYieldData continuously collects yield data
func (dc *DataCollector) collectYieldData() {
	ticker := time.NewTicker(1 * time.Minute) // Update every minute
	defer ticker.Stop()

	for {
		select {
		case <-dc.ctx.Done():
			return
		case <-ticker.C:
			yieldData, err := dc.GetYieldData()
			if err != nil {
				log.Printf("Error fetching yield data: %v", err)
				continue
			}

			// Process and store yield data
			dc.processYieldData(yieldData)
		}
	}
}

// collectMarketIndicators collects broader market indicators
func (dc *DataCollector) collectMarketIndicators() {
	ticker := time.NewTicker(30 * time.Second) // Update every 30 seconds
	defer ticker.Stop()

	for {
		select {
		case <-dc.ctx.Done():
			return
		case <-ticker.C:
			// Collect market indicators
			indicators, err := dc.getMarketIndicators()
			if err != nil {
				log.Printf("Error fetching market indicators: %v", err)
				continue
			}

			// Process indicators
			dc.processMarketIndicators(indicators)
		}
	}
}

// broadcastPriceData sends price data to all subscribers
func (dc *DataCollector) broadcastPriceData(token string, data models.PriceData) {
	dc.mu.RLock()
	subscribers := dc.subscribers[token]
	dc.mu.RUnlock()

	for _, ch := range subscribers {
		select {
		case ch <- data:
		default:
			// Channel is full, skip this update
		}
	}
}

// processYieldData processes and stores yield data
func (dc *DataCollector) processYieldData(yieldData []models.YieldData) {
	// TODO: Store in time-series database (InfluxDB)
	// For now, just log the data
	log.Printf("Processed %d yield data points", len(yieldData))
}

// getMarketIndicators fetches market indicators
func (dc *DataCollector) getMarketIndicators() (*models.MarketIndicators, error) {
	// For now, return mock data to avoid API issues
	// TODO: Implement real API calls with proper error handling
	return &models.MarketIndicators{
		FearGreedIndex: 50.0,
		TotalMarketCap: 1.5e12, // 1.5T
		BTCDominance:   45.0,
		ETHDominance:   18.5,
		DeFiTVL:        50e9, // 50B
		Volatility:     0.25,
		Timestamp:      time.Now(),
	}, nil
}

// processMarketIndicators processes market indicators
func (dc *DataCollector) processMarketIndicators(indicators *models.MarketIndicators) {
	// TODO: Store in database and trigger AI analysis
	log.Printf("Market cap: $%.2fB, BTC dominance: %.2f%%, ETH dominance: %.2f%%",
		indicators.TotalMarketCap/1e9, indicators.BTCDominance, indicators.ETHDominance)
}

// calculateRiskScore calculates a risk score for a protocol
func (dc *DataCollector) calculateRiskScore(protocol string, tvl float64) float64 {
	// Simple risk scoring based on protocol reputation and TVL
	// TODO: Implement more sophisticated risk analysis

	highRepProtocols := map[string]bool{
		"aave": true, "compound": true, "uniswap": true, "curve": true,
		"lido": true, "convex": true, "yearn": true,
	}

	risk := 0.5 // Base risk

	if highRepProtocols[protocol] {
		risk -= 0.2 // Lower risk for established protocols
	}

	if tvl > 100000000 { // $100M+
		risk -= 0.1 // Lower risk for high TVL protocols
	} else if tvl < 10000000 { // $10M-
		risk += 0.2 // Higher risk for low TVL protocols
	}

	// Ensure risk is between 0 and 1
	if risk < 0 {
		risk = 0
	}
	if risk > 1 {
		risk = 1
	}

	return risk
}
