# Go AI Engine Service Monitoring

This document covers the comprehensive monitoring setup for the Go AI Engine service, including error tracking, performance monitoring, health checks, and alerting integration.

## Overview

The Go AI Engine service (`apps/ai-engine`) now includes production-grade monitoring capabilities that integrate with our overall monitoring infrastructure:

- **Sentry Integration**: Error tracking and performance monitoring
- **Comprehensive Health Checks**: Detailed service health assessment
- **Performance Monitoring**: Built-in performance metrics and tracking
- **Uptime Monitoring**: Integration with external monitoring services
- **Structured Logging**: Enhanced logging with context and monitoring integration

## Sentry Integration

### Configuration

The Go service uses the Sentry Go SDK for error tracking and performance monitoring.

#### Environment Variables

```bash
# Required for Sentry integration
SENTRY_DSN=https://your-dsn@sentry.io/project-id
ENVIRONMENT=production  # or development/staging
RELEASE_VERSION=1.0.0   # Application version for tracking
```

#### Initialization

Sentry is automatically initialized in `main.go`:

```go
// Initialize Sentry monitoring first
if err := monitoring.InitializeSentry(); err != nil {
    log.Printf("Warning: Failed to initialize Sentry: %v", err)
} else {
    // Ensure Sentry is properly flushed on exit
    defer monitoring.Close()
}
```

### Error Tracking

The service automatically captures errors with rich context:

```go
monitoring.CaptureError(err, map[string]string{
    "component": "data_collector",
    "error_type": "startup_failure",
}, map[string]interface{}{
    "additional_context": "value",
})
```

### Performance Monitoring

Sentry transactions are used to track performance:

```go
transaction := monitoring.StartTransaction("optimize_portfolio", "ai_processing")
defer transaction.Finish()

// Your AI processing code here
```

### Message Logging

Important events are logged to Sentry:

```go
monitoring.CaptureMessage("AI Engine startup completed",
    monitoring.LevelInfo,
    map[string]string{
        "component": "startup",
        "port": strconv.Itoa(port),
    })
```

## Comprehensive Health Checks

### Health Check Endpoint

The `/health` endpoint provides detailed health information:

```http
GET /health
```

**Response Example:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "2h30m15s",
  "system": {
    "go_version": "go1.21.5",
    "num_goroutines": 8,
    "memory_mb": 45.2,
    "num_cpu": 8
  },
  "components": {
    "ai_engine": {
      "status": "healthy",
      "latency": 2.5,
      "last_check": "2024-01-15T10:30:00Z"
    },
    "data_collector": {
      "status": "healthy",
      "latency": 1.8,
      "last_check": "2024-01-15T10:30:00Z"
    },
    "memory": {
      "status": "healthy",
      "latency": 0.1,
      "last_check": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Health Status Codes

- **200 OK**: Service is healthy
- **200 OK** (with warnings): Service is degraded but functional
- **503 Service Unavailable**: Service is unhealthy

### Component Health Checks

#### AI Engine Health
- Checks performance monitor responsiveness
- Validates error rate is below 10%
- Ensures average response time is below 100ms

#### Data Collector Health
- Verifies data collector is initialized and running
- Can be extended to check last update times

#### Memory Health
- Monitors memory usage
- Alerts if memory usage exceeds 500MB

## Performance Monitoring

### Built-in Performance Monitor

The Go service includes a built-in performance monitoring system:

```go
// Performance metrics are automatically tracked
type PerformanceMonitor struct {
    totalRequests     int64
    totalResponseTime time.Duration
    avgResponseTime   time.Duration
    endpointMetrics   map[string]*EndpointMetrics
    errorCount        int64
    errorRate         float64
    startTime         time.Time
    uptime           time.Duration
}
```

### Metrics Tracked

- **Request Count**: Total number of requests processed
- **Response Times**: Min, max, average response times per endpoint
- **Error Rates**: Error percentage and counts
- **Uptime**: Service uptime tracking
- **Memory Usage**: Real-time memory consumption

### Performance Endpoints

Performance metrics are available through health checks and can be extended for Prometheus export.

## Integration with Uptime Monitoring

### UptimeRobot Configuration

Add the Go service health endpoint to UptimeRobot:

1. **Monitor Type**: HTTP(s)
2. **URL**: `https://your-domain.com/health`
3. **Monitoring Interval**: 5 minutes
4. **Expected Status Code**: 200
5. **Expected Content**: `"healthy"`

### Better Stack (Uptime Robot Alternative)

```yaml
# better-stack-config.yml
monitors:
  - name: "AI Engine Health"
    url: "https://your-ai-engine-domain.com/health"
    method: "GET"
    interval: 300  # 5 minutes
    timeout: 30
    expected_status: 200
    expected_content: "healthy"
```

### Health Check Integration

The health endpoint is designed to work with uptime monitoring services:

- Returns appropriate HTTP status codes
- Includes expected content for validation
- Provides detailed error information when unhealthy

## Logging and Observability

### Structured Logging

The Go service uses structured logging with Sentry integration:

```go
log.Printf("Starting HTTP server on port %d...", port)
monitoring.CaptureMessage("HTTP server starting",
    monitoring.LevelInfo,
    map[string]string{
        "component": "http_server",
        "port": strconv.Itoa(port),
    })
```

### Log Levels

- **Debug**: Detailed debugging information
- **Info**: General information about service operation
- **Warning**: Warning conditions that should be monitored
- **Error**: Error conditions that need attention
- **Fatal**: Critical errors that cause service termination

### Context Enrichment

All logs and errors include contextual information:

- **Component**: Which part of the system generated the log
- **Operation**: What operation was being performed
- **Timestamps**: When events occurred
- **User Context**: When applicable, user information
- **Request Context**: Request IDs and related information

## Alerting Configuration

### Sentry Alerts

Configure Sentry alerts for:

1. **Error Rate Threshold**
   - Condition: Error rate > 5% over 5 minutes
   - Action: Send to team Slack channel

2. **High Response Time**
   - Condition: Average response time > 150ms over 10 minutes
   - Action: Email alerts to on-call engineer

3. **Memory Usage**
   - Condition: Memory usage > 400MB
   - Action: Warning notification

### Uptime Monitoring Alerts

Configure uptime monitoring alerts for:

1. **Service Down**
   - Condition: Health check fails 2 consecutive times
   - Action: Immediate SMS/email alerts

2. **Response Time**
   - Condition: Health check takes > 5 seconds
   - Action: Warning notification

## Deployment Considerations

### Environment Variables

Ensure these environment variables are set in production:

```bash
# Monitoring
SENTRY_DSN=https://your-dsn@sentry.io/project-id
ENVIRONMENT=production
RELEASE_VERSION=1.2.3

# Service Configuration
PORT=8080
LOG_LEVEL=info

# Health Check Configuration
HEALTH_CHECK_ENABLED=true
PERFORMANCE_MONITORING_ENABLED=true
```

### Vercel Deployment

For Vercel deployment, add environment variables in the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all required environment variables
3. Ensure they're available for Production, Preview, and Development

### Docker Deployment

For Docker deployment, include monitoring setup:

```dockerfile
# Health check in Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
```

## Monitoring Dashboard

### Key Metrics to Monitor

1. **Service Health**
   - Overall health status
   - Component health breakdown
   - Uptime percentage

2. **Performance Metrics**
   - Request throughput (RPS)
   - Average response time
   - Error rate percentage
   - Memory usage trends

3. **Error Tracking**
   - Error frequency and types
   - Error rate trends
   - Critical error alerts

### Grafana Dashboard (Future)

Consider setting up a Grafana dashboard with:

- Service health overview
- Performance metrics charts
- Error rate trends
- Memory and CPU usage graphs

## Best Practices

### Error Handling

1. **Always provide context** when capturing errors
2. **Use appropriate log levels** for different types of events
3. **Include request IDs** when available for tracing
4. **Avoid logging sensitive information**

### Performance Monitoring

1. **Monitor critical paths** (portfolio optimization, market data)
2. **Set realistic thresholds** based on SLA requirements
3. **Track trends over time** rather than just point-in-time metrics
4. **Use sampling for high-volume transactions**

### Health Checks

1. **Include all critical dependencies** in health checks
2. **Provide actionable information** in health responses
3. **Use appropriate timeouts** to avoid cascading failures
4. **Test health checks in different failure scenarios**

## Troubleshooting

### Common Issues

1. **Sentry Not Initializing**
   - Check SENTRY_DSN environment variable
   - Verify network connectivity to Sentry
   - Check for initialization errors in logs

2. **Health Check Failures**
   - Verify all components are properly initialized
   - Check for memory or performance threshold breaches
   - Review component-specific error messages

3. **High Memory Usage**
   - Check for goroutine leaks
   - Review data collector memory usage
   - Monitor garbage collection frequency

### Debug Mode

Enable debug logging for troubleshooting:

```bash
LOG_LEVEL=debug go run main.go
```

This will provide detailed information about:
- Sentry initialization
- Health check execution
- Performance monitoring data
- Error context and stack traces

## Future Enhancements

### Prometheus Integration

Consider adding Prometheus metrics export:

```go
// Future: Prometheus metrics
var (
    requestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )
)
```

### Distributed Tracing

For microservices architecture, consider adding OpenTelemetry:

```go
// Future: OpenTelemetry integration
import "go.opentelemetry.io/otel"
```

### Advanced Health Checks

Enhanced health checks could include:
- Database connectivity checks
- External API dependency checks
- Disk space monitoring
- Network connectivity validation

This comprehensive monitoring setup ensures the Go AI Engine service is production-ready with full observability and alerting capabilities.
