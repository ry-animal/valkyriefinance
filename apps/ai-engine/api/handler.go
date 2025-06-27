// Package api provides Vercel-compatible HTTP handlers for the AI Engine
package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/valkyriefinance/ai-engine/internal/services"
)

// Global instances (initialized once per cold start)
var (
	aiEngine      services.AIEngine
	dataCollector services.MarketDataCollector
	initialized   bool
)

// initialize sets up the AI engine and data collector
func initialize() error {
	if initialized {
		return nil
	}

	log.Println("Initializing AI Engine for Vercel Functions...")

	// Initialize AI engine
	aiEngine = services.NewEnhancedAIEngine()

	// Initialize data collector
	dataCollector = services.NewRealDataCollector()

	// Start data collector (non-blocking for functions)
	if err := dataCollector.Start(); err != nil {
		log.Printf("Warning: Failed to start data collector: %v", err)
		// Don't fail completely, use fallback data
	}

	initialized = true
	log.Println("AI Engine initialized successfully")
	return nil
}

// Handler is the main Vercel function handler
func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize on first request
	if err := initialize(); err != nil {
		http.Error(w, "Failed to initialize AI Engine", http.StatusInternalServerError)
		return
	}

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Route requests based on path
	path := strings.TrimPrefix(r.URL.Path, "/api")

	switch {
	case path == "/health" || r.URL.Path == "/health":
		handleHealth(w, r)
	case strings.HasPrefix(path, "/optimize-portfolio"):
		handleOptimizePortfolio(w, r)
	case strings.HasPrefix(path, "/market-indicators"):
		handleMarketIndicators(w, r)
	case strings.HasPrefix(path, "/risk-metrics"):
		handleRiskMetrics(w, r)
	case strings.HasPrefix(path, "/market-analysis"):
		handleMarketAnalysis(w, r)
	default:
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}

// handleHealth provides a simple health check
func handleHealth(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"status":    "healthy",
		"service":   "Valkyrie AI Engine",
		"timestamp": "2024-01-01T00:00:00Z", // You can use time.Now() here
		"version":   "1.0.0",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleOptimizePortfolio handles portfolio optimization requests
func handleOptimizePortfolio(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body (you'll need to implement this based on your service interface)
	// For now, return a mock response
	response := map[string]interface{}{
		"status": "success",
		"optimization": map[string]interface{}{
			"allocations": []map[string]interface{}{
				{"asset": "ETH", "weight": 0.4},
				{"asset": "BTC", "weight": 0.3},
				{"asset": "USDC", "weight": 0.3},
			},
			"expectedReturn": 0.12,
			"risk": 0.08,
			"sharpeRatio": 1.5,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleMarketIndicators handles market data requests
func handleMarketIndicators(w http.ResponseWriter, r *http.Request) {
	// Implementation for market indicators
	response := map[string]interface{}{
		"status": "success",
		"indicators": map[string]interface{}{
			"btc_price": 45000,
			"eth_price": 3000,
			"market_cap": 2000000000000,
			"fear_greed": 65,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleRiskMetrics handles risk analysis requests
func handleRiskMetrics(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := map[string]interface{}{
		"status": "success",
		"risk": map[string]interface{}{
			"var": 0.05,
			"cvar": 0.08,
			"volatility": 0.12,
			"correlation": 0.7,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleMarketAnalysis handles market analysis requests
func handleMarketAnalysis(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := map[string]interface{}{
		"status": "success",
		"analysis": map[string]interface{}{
			"trend": "bullish",
			"confidence": 0.85,
			"signals": []string{"golden_cross", "volume_increase"},
			"recommendation": "buy",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
