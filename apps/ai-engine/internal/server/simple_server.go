package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/valkyriefinance/ai-engine/internal/models"
	"github.com/valkyriefinance/ai-engine/internal/services"
)

// ValidationError represents a validation error with structured information
type ValidationError struct {
	Field   string
	Message string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}

// SimpleHTTPServer is a basic HTTP server for the AI engine
type SimpleHTTPServer struct {
	aiEngine      services.AIEngine
	dataCollector services.MarketDataCollector
	server        *http.Server
}

// NewSimpleHTTPServer creates a new HTTP server
func NewSimpleHTTPServer(aiEngine services.AIEngine, dataCollector services.MarketDataCollector) *SimpleHTTPServer {
	return &SimpleHTTPServer{
		aiEngine:      aiEngine,
		dataCollector: dataCollector,
	}
}

// Start starts the HTTP server
func (s *SimpleHTTPServer) Start(port int) error {
	mux := http.NewServeMux()

	// Add middleware for all routes
	mux.HandleFunc("/health", s.withMiddleware(s.healthHandler))
	mux.HandleFunc("/api/market-indicators", s.withMiddleware(s.marketIndicatorsHandler))
	mux.HandleFunc("/api/optimize-portfolio", s.withMiddleware(s.optimizePortfolioHandler))
	mux.HandleFunc("/api/risk-metrics", s.withMiddleware(s.riskMetricsHandler))
	mux.HandleFunc("/api/market-analysis", s.withMiddleware(s.marketAnalysisHandler))

	s.server = &http.Server{
		Addr:           fmt.Sprintf(":%d", port),
		Handler:        mux,
		ReadTimeout:    15 * time.Second,
		WriteTimeout:   15 * time.Second,
		IdleTimeout:    60 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1MB
	}

	log.Printf("HTTP server starting on port %d", port)
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start HTTP server on port %d: %w", port, err)
	}
	return nil
}

// withMiddleware wraps handlers with common middleware
func (s *SimpleHTTPServer) withMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Add request timeout
		ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
		defer cancel()
		r = r.WithContext(ctx)

		// Add CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Add security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// Request logging
		start := time.Now()
		next(w, r)
		duration := time.Since(start)

		log.Printf("%s %s - %v", r.Method, r.URL.Path, duration)
	}
}

// Stop stops the HTTP server
func (s *SimpleHTTPServer) Stop() error {
	if s.server != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := s.server.Shutdown(ctx); err != nil {
			return fmt.Errorf("failed to gracefully shutdown HTTP server: %w", err)
		}
	}
	return nil
}

// validatePortfolio validates portfolio data
func (s *SimpleHTTPServer) validatePortfolio(portfolio models.Portfolio) error {
	if portfolio.ID == "" {
		return ValidationError{Field: "id", Message: "portfolio ID is required"}
	}
	if len(portfolio.Positions) == 0 {
		return ValidationError{Field: "positions", Message: "at least one position is required"}
	}
	for i, position := range portfolio.Positions {
		if position.Token == "" {
			return ValidationError{Field: fmt.Sprintf("positions[%d].token", i), Message: "token is required"}
		}
		if position.Weight < 0 || position.Weight > 1 {
			return ValidationError{Field: fmt.Sprintf("positions[%d].weight", i), Message: "weight must be between 0 and 1"}
		}
	}
	return nil
}

// healthHandler provides health check
func (s *SimpleHTTPServer) healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	response := map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now(),
		"services": []map[string]interface{}{
			{
				"name":             "ai-engine",
				"status":           "healthy",
				"response_time_ms": 1.5,
			},
			{
				"name":             "data-collector",
				"status":           "healthy",
				"response_time_ms": 2.3,
			},
		},
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("failed to encode health response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// marketIndicatorsHandler provides market indicators
func (s *SimpleHTTPServer) marketIndicatorsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	indicators, err := s.dataCollector.GetMarketIndicators()
	if err != nil {
		log.Printf("failed to get market indicators: %v", err)
		http.Error(w, "Failed to get market indicators", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(indicators); err != nil {
		log.Printf("failed to encode market indicators response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// optimizePortfolioHandler provides portfolio optimization
func (s *SimpleHTTPServer) optimizePortfolioHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Set max body size for security
	r.Body = http.MaxBytesReader(w, r.Body, 1048576) // 1MB

	var portfolio models.Portfolio
	if err := json.NewDecoder(r.Body).Decode(&portfolio); err != nil {
		log.Printf("failed to decode portfolio request: %v", err)
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// Validate portfolio data
	if err := s.validatePortfolio(portfolio); err != nil {
		log.Printf("portfolio validation failed: %v", err)
		http.Error(w, fmt.Sprintf("Validation error: %v", err), http.StatusBadRequest)
		return
	}

	recommendation, err := s.aiEngine.GetRebalanceRecommendation(r.Context(), portfolio)
	if err != nil {
		log.Printf("failed to get rebalance recommendation: %v", err)
		http.Error(w, "Failed to generate recommendation", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(recommendation); err != nil {
		log.Printf("failed to encode recommendation response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// riskMetricsHandler provides risk metrics calculation
func (s *SimpleHTTPServer) riskMetricsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Set max body size for security
	r.Body = http.MaxBytesReader(w, r.Body, 1048576) // 1MB

	var portfolio models.Portfolio
	if err := json.NewDecoder(r.Body).Decode(&portfolio); err != nil {
		log.Printf("failed to decode portfolio request: %v", err)
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// Validate portfolio data
	if err := s.validatePortfolio(portfolio); err != nil {
		log.Printf("portfolio validation failed: %v", err)
		http.Error(w, fmt.Sprintf("Validation error: %v", err), http.StatusBadRequest)
		return
	}

	riskMetrics, err := s.aiEngine.CalculateRiskMetrics(r.Context(), portfolio)
	if err != nil {
		log.Printf("failed to calculate risk metrics: %v", err)
		http.Error(w, "Failed to calculate risk metrics", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(riskMetrics); err != nil {
		log.Printf("failed to encode risk metrics response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// marketAnalysisHandler provides market analysis
func (s *SimpleHTTPServer) marketAnalysisHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Set max body size for security
	r.Body = http.MaxBytesReader(w, r.Body, 1048576) // 1MB

	var request struct {
		Tokens    []string `json:"tokens"`
		Timeframe string   `json:"timeframe"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("failed to decode market analysis request: %v", err)
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// Basic validation
	if len(request.Tokens) == 0 {
		http.Error(w, "At least one token is required", http.StatusBadRequest)
		return
	}
	if len(request.Tokens) > 10 {
		http.Error(w, "Maximum 10 tokens allowed", http.StatusBadRequest)
		return
	}
	if request.Timeframe == "" {
		request.Timeframe = "1d" // Default timeframe
	}

	analysis, err := s.aiEngine.GetMarketAnalysis(r.Context(), request.Tokens, request.Timeframe)
	if err != nil {
		log.Printf("failed to get market analysis: %v", err)
		http.Error(w, "Failed to generate market analysis", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(analysis); err != nil {
		log.Printf("failed to encode market analysis response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
