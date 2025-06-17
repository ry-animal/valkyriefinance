package services

import (
	"sync"
	"time"
)

// PerformanceMonitor tracks AI engine performance metrics
type PerformanceMonitor struct {
	mu sync.RWMutex

	// Request metrics
	totalRequests     int64
	totalResponseTime time.Duration
	avgResponseTime   time.Duration

	// Endpoint specific metrics
	endpointMetrics map[string]*EndpointMetrics

	// Error tracking
	errorCount int64
	errorRate  float64

	// System metrics
	startTime time.Time
	uptime    time.Duration
}

// EndpointMetrics tracks metrics for specific endpoints
type EndpointMetrics struct {
	RequestCount    int64
	TotalTime       time.Duration
	AverageTime     time.Duration
	MinTime         time.Duration
	MaxTime         time.Duration
	ErrorCount      int64
	LastRequestTime time.Time
}

// NewPerformanceMonitor creates a new performance monitor
func NewPerformanceMonitor() *PerformanceMonitor {
	return &PerformanceMonitor{
		endpointMetrics: make(map[string]*EndpointMetrics),
		startTime:       time.Now(),
	}
}

// RecordRequest records a request for performance tracking
func (pm *PerformanceMonitor) RecordRequest(endpoint string, duration time.Duration, isError bool) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	// Update total metrics
	pm.totalRequests++
	pm.totalResponseTime += duration
	pm.avgResponseTime = pm.totalResponseTime / time.Duration(pm.totalRequests)

	if isError {
		pm.errorCount++
	}
	pm.errorRate = float64(pm.errorCount) / float64(pm.totalRequests)

	// Update endpoint specific metrics
	metrics, exists := pm.endpointMetrics[endpoint]
	if !exists {
		metrics = &EndpointMetrics{
			MinTime: duration,
			MaxTime: duration,
		}
		pm.endpointMetrics[endpoint] = metrics
	}

	metrics.RequestCount++
	metrics.TotalTime += duration
	metrics.AverageTime = metrics.TotalTime / time.Duration(metrics.RequestCount)
	metrics.LastRequestTime = time.Now()

	if duration < metrics.MinTime {
		metrics.MinTime = duration
	}
	if duration > metrics.MaxTime {
		metrics.MaxTime = duration
	}

	if isError {
		metrics.ErrorCount++
	}

	// Update uptime
	pm.uptime = time.Since(pm.startTime)
}

// GetMetrics returns current performance metrics
func (pm *PerformanceMonitor) GetMetrics() map[string]interface{} {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	endpointData := make(map[string]interface{})
	for endpoint, metrics := range pm.endpointMetrics {
		endpointData[endpoint] = map[string]interface{}{
			"request_count":   metrics.RequestCount,
			"average_time_ms": float64(metrics.AverageTime.Nanoseconds()) / 1e6,
			"min_time_ms":     float64(metrics.MinTime.Nanoseconds()) / 1e6,
			"max_time_ms":     float64(metrics.MaxTime.Nanoseconds()) / 1e6,
			"error_count":     metrics.ErrorCount,
			"error_rate":      float64(metrics.ErrorCount) / float64(metrics.RequestCount),
			"last_request":    metrics.LastRequestTime.Format(time.RFC3339),
		}
	}

	return map[string]interface{}{
		"uptime_seconds":      pm.uptime.Seconds(),
		"total_requests":      pm.totalRequests,
		"average_response_ms": float64(pm.avgResponseTime.Nanoseconds()) / 1e6,
		"error_rate":          pm.errorRate,
		"requests_per_minute": float64(pm.totalRequests) / pm.uptime.Minutes(),
		"endpoints":           endpointData,
		"timestamp":           time.Now().Format(time.RFC3339),
	}
}

// GetHealthStatus returns health status based on performance metrics
func (pm *PerformanceMonitor) GetHealthStatus() string {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	// Health criteria
	if pm.errorRate > 0.1 { // More than 10% error rate
		return "unhealthy"
	}

	if pm.avgResponseTime > 100*time.Millisecond { // Average response time > 100ms
		return "degraded"
	}

	return "healthy"
}

// Reset resets all performance metrics
func (pm *PerformanceMonitor) Reset() {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	pm.totalRequests = 0
	pm.totalResponseTime = 0
	pm.avgResponseTime = 0
	pm.errorCount = 0
	pm.errorRate = 0
	pm.endpointMetrics = make(map[string]*EndpointMetrics)
	pm.startTime = time.Now()
	pm.uptime = 0
}
