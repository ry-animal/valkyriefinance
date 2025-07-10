// Package health provides comprehensive health checking for the AI engine
package health

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/valkyriefinance/ai-engine/internal/monitoring"
	"github.com/valkyriefinance/ai-engine/internal/services"
)

// HealthStatus represents the overall health status
type HealthStatus string

const (
	StatusHealthy   HealthStatus = "healthy"
	StatusDegraded  HealthStatus = "degraded"
	StatusUnhealthy HealthStatus = "unhealthy"
)

// ComponentHealth represents health status of a component
type ComponentHealth struct {
	Status    HealthStatus `json:"status"`
	Latency   *float64     `json:"latency,omitempty"`
	Error     *string      `json:"error,omitempty"`
	LastCheck time.Time    `json:"last_check"`
}

// HealthResponse represents the complete health check response
type HealthResponse struct {
	Status     HealthStatus               `json:"status"`
	Timestamp  time.Time                  `json:"timestamp"`
	Version    string                     `json:"version"`
	Uptime     string                     `json:"uptime"`
	System     SystemInfo                 `json:"system"`
	Components map[string]ComponentHealth `json:"components"`
}

// SystemInfo contains system-level information
type SystemInfo struct {
	GoVersion    string  `json:"go_version"`
	NumGoroutines int    `json:"num_goroutines"`
	MemoryMB     float64 `json:"memory_mb"`
	NumCPU       int     `json:"num_cpu"`
}

// HealthChecker manages health checks for the AI engine
type HealthChecker struct {
	startTime       time.Time
	performanceMonitor *services.PerformanceMonitor
	dataCollector   services.MarketDataCollector
}

// NewHealthChecker creates a new health checker
func NewHealthChecker(perfMonitor *services.PerformanceMonitor, dataCollector services.MarketDataCollector) *HealthChecker {
	return &HealthChecker{
		startTime:       time.Now(),
		performanceMonitor: perfMonitor,
		dataCollector:   dataCollector,
	}
}

// CheckHealth performs a comprehensive health check
func (h *HealthChecker) CheckHealth() HealthResponse {
	response := HealthResponse{
		Timestamp:  time.Now(),
		Version:    getVersion(),
		Uptime:     time.Since(h.startTime).String(),
		System:     h.getSystemInfo(),
		Components: make(map[string]ComponentHealth),
	}

	// Check AI Engine health
	response.Components["ai_engine"] = h.checkAIEngine()

	// Check Data Collector health
	response.Components["data_collector"] = h.checkDataCollector()

	// Check Memory health
	response.Components["memory"] = h.checkMemory()

	// Determine overall status
	response.Status = h.determineOverallStatus(response.Components)

	return response
}

// checkAIEngine checks the health of the AI engine component
func (h *HealthChecker) checkAIEngine() ComponentHealth {
	start := time.Now()

	if h.performanceMonitor == nil {
		return ComponentHealth{
			Status:    StatusUnhealthy,
			Error:     stringPtr("Performance monitor not initialized"),
			LastCheck: time.Now(),
		}
	}

	// Get performance metrics to check if AI engine is responsive
	metrics := h.performanceMonitor.GetMetrics()
	latency := time.Since(start).Seconds() * 1000 // Convert to milliseconds

	// Check if error rate is acceptable
	if errorRate, ok := metrics["error_rate"].(float64); ok && errorRate > 0.1 {
		return ComponentHealth{
			Status:    StatusDegraded,
			Latency:   &latency,
			Error:     stringPtr(fmt.Sprintf("High error rate: %.2f%%", errorRate*100)),
			LastCheck: time.Now(),
		}
	}

	// Check if average response time is acceptable
	if avgResponseMs, ok := metrics["average_response_ms"].(float64); ok && avgResponseMs > 100 {
		return ComponentHealth{
			Status:    StatusDegraded,
			Latency:   &latency,
			Error:     stringPtr(fmt.Sprintf("High response time: %.2fms", avgResponseMs)),
			LastCheck: time.Now(),
		}
	}

	return ComponentHealth{
		Status:    StatusHealthy,
		Latency:   &latency,
		LastCheck: time.Now(),
	}
}

// checkDataCollector checks the health of the data collector
func (h *HealthChecker) checkDataCollector() ComponentHealth {
	start := time.Now()

	if h.dataCollector == nil {
		return ComponentHealth{
			Status:    StatusUnhealthy,
			Error:     stringPtr("Data collector not initialized"),
			LastCheck: time.Now(),
		}
	}

	latency := time.Since(start).Seconds() * 1000

	// For now, we assume data collector is healthy if it's initialized
	// In a real implementation, you might want to check last update time, etc.
	return ComponentHealth{
		Status:    StatusHealthy,
		Latency:   &latency,
		LastCheck: time.Now(),
	}
}

// checkMemory checks memory usage health
func (h *HealthChecker) checkMemory() ComponentHealth {
	start := time.Now()

	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	memoryMB := float64(m.Alloc) / 1024 / 1024
	latency := time.Since(start).Seconds() * 1000

	// Alert if memory usage is too high (>500MB)
	if memoryMB > 500 {
		return ComponentHealth{
			Status:    StatusDegraded,
			Latency:   &latency,
			Error:     stringPtr(fmt.Sprintf("High memory usage: %.2fMB", memoryMB)),
			LastCheck: time.Now(),
		}
	}

	return ComponentHealth{
		Status:    StatusHealthy,
		Latency:   &latency,
		LastCheck: time.Now(),
	}
}

// getSystemInfo collects system information
func (h *HealthChecker) getSystemInfo() SystemInfo {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	return SystemInfo{
		GoVersion:     runtime.Version(),
		NumGoroutines: runtime.NumGoroutine(),
		MemoryMB:      float64(m.Alloc) / 1024 / 1024,
		NumCPU:        runtime.NumCPU(),
	}
}

// determineOverallStatus determines the overall health status
func (h *HealthChecker) determineOverallStatus(components map[string]ComponentHealth) HealthStatus {
	hasUnhealthy := false
	hasDegraded := false

	for _, component := range components {
		switch component.Status {
		case StatusUnhealthy:
			hasUnhealthy = true
		case StatusDegraded:
			hasDegraded = true
		}
	}

	if hasUnhealthy {
		return StatusUnhealthy
	}
	if hasDegraded {
		return StatusDegraded
	}
	return StatusHealthy
}

// getVersion gets the application version
func getVersion() string {
	if version := os.Getenv("RELEASE_VERSION"); version != "" {
		return version
	}
	return "1.0.0"
}

// stringPtr returns a pointer to a string
func stringPtr(s string) *string {
	return &s
}

// HTTPHandler creates an HTTP handler for health checks
func (h *HealthChecker) HTTPHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Perform health check
		health := h.CheckHealth()

		// Set appropriate HTTP status code
		statusCode := http.StatusOK
		switch health.Status {
		case StatusDegraded:
			statusCode = http.StatusOK // 200 but with warnings
		case StatusUnhealthy:
			statusCode = http.StatusServiceUnavailable // 503
		}

		// Set headers
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store, max-age=0")
		w.WriteHeader(statusCode)

		// Encode response
		if err := json.NewEncoder(w).Encode(health); err != nil {
			monitoring.CaptureError(err, map[string]string{
				"endpoint": "health",
				"error_type": "json_encoding",
			}, map[string]interface{}{
				"request_uri": r.RequestURI,
			})

			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}
}
