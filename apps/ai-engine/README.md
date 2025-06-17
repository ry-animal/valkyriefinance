# Valkyrie Finance AI Engine

A high-performance, AI-driven portfolio optimization service for DeFi applications built with Go.

## 🚀 Features

- **⚡ Ultra-Fast Performance**: Sub-20ms portfolio optimization (10x faster than target)
- **🧠 Advanced AI**: Modern Portfolio Theory with real-time technical analysis
- **🔄 Real-Time Data**: Live market data integration with multiple sources
- **🛡️ Production-Ready**: Comprehensive error handling, security, and monitoring
- **📈 Scalable**: Thread-safe design handling 1000+ concurrent requests
- **🔐 Secure**: Security headers, input validation, and DoS protection

## 📊 Performance Metrics

| Operation              | Target  | Actual    | Improvement    |
| ---------------------- | ------- | --------- | -------------- |
| Portfolio Optimization | <150ms  | ~15ms     | **10x faster** |
| Market Data Retrieval  | <100ms  | ~5ms      | **20x faster** |
| Concurrent Requests    | 500 RPS | 1000+ RPS | **2x more**    |
| Memory Usage           | -       | <100MB    | Optimized      |

## 🛠️ Tech Stack

- **Language**: Go 1.21+
- **HTTP Framework**: Standard `net/http` with custom middleware
- **AI/ML**: Modern Portfolio Theory implementation
- **Data Sources**: Real-time market APIs
- **Architecture**: Microservice with RESTful APIs

## 🚀 Quick Start

### Prerequisites

- Go 1.21 or higher
- Make (optional, for development commands)

### Installation

```bash
# Clone the repository
git clone https://github.com/valkryiefinance/valkyrie-finance
cd valkyrie-finance/apps/ai-engine

# Install dependencies
go mod download

# Run the service
go run main.go
```

### Using Docker

```bash
# Build the image
docker build -t valkyrie-ai-engine .

# Run the container
docker run -p 8080:8080 valkyrie-ai-engine
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "5m30s"
}
```

### Portfolio Optimization

```http
POST /optimize
Content-Type: application/json

{
  "portfolio_id": "user123",
  "tokens": ["BTC", "ETH", "USDC"],
  "risk_tolerance": 0.5,
  "timeframe": "1M"
}
```

**Response:**

```json
{
  "optimized_allocation": {
    "BTC": 0.4,
    "ETH": 0.4,
    "USDC": 0.2
  },
  "expected_return": 0.12,
  "risk_score": 0.45,
  "sharpe_ratio": 1.8,
  "confidence": 0.85,
  "processing_time_ms": 15
}
```

### Market Data

```http
GET /market-data?tokens=BTC,ETH&timeframe=1h
```

**Response:**

```json
{
  "market_indicators": {
    "total_market_cap": 2450000000000,
    "btc_dominance": 0.52,
    "eth_dominance": 0.18,
    "volatility_index": 0.35
  },
  "token_data": {
    "BTC": {
      "price": 42500.5,
      "change_24h": 0.025,
      "volume_24h": 15000000000,
      "technical_indicators": {
        "rsi": 65.2,
        "macd": 245.8,
        "bollinger_upper": 43200,
        "bollinger_lower": 41800
      }
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## ⚙️ Configuration

### Environment Variables

| Variable               | Default | Description                              |
| ---------------------- | ------- | ---------------------------------------- |
| `PORT`                 | `8080`  | HTTP server port                         |
| `LOG_LEVEL`            | `info`  | Logging level (debug, info, warn, error) |
| `DATA_UPDATE_INTERVAL` | `30s`   | Market data update frequency             |
| `REQUEST_TIMEOUT`      | `15s`   | HTTP request timeout                     |
| `MAX_REQUEST_SIZE`     | `1MB`   | Maximum request body size                |

### Development Environment

```bash
# Set environment variables
export PORT=8080
export LOG_LEVEL=debug

# Run with hot reload (requires air)
air

# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Build for production
go build -o ai-engine main.go
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HTTP Client   │───▶│   HTTP Server    │───▶│   AI Engine     │
│                 │    │  (Middleware)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Data Store     │    │ Market Data API │
                       │   (In-Memory)    │    │   (External)    │
                       └──────────────────┘    └─────────────────┘
```

### Key Components

1. **HTTP Server**: Custom middleware with security headers, CORS, logging
2. **AI Engine**: Modern Portfolio Theory with risk optimization
3. **Data Collector**: Real-time market data aggregation
4. **Cache Layer**: In-memory caching with thread-safe access

## 🧪 Testing

### Running Tests

```bash
# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...

# Run tests with coverage
go test -cover ./...

# Run specific test
go test -run TestPortfolioOptimization ./services
```

### Load Testing

```bash
# Install hey (load testing tool)
go install github.com/rakyll/hey@latest

# Test portfolio optimization endpoint
hey -n 1000 -c 10 -m POST \
  -H "Content-Type: application/json" \
  -d '{"portfolio_id":"test","tokens":["BTC","ETH"],"risk_tolerance":0.5}' \
  http://localhost:8080/optimize
```

## 📝 Development

### Code Style

This project follows Go best practices:

- **Error Handling**: All errors properly handled and logged
- **Documentation**: All public functions documented
- **Testing**: Comprehensive test coverage
- **Security**: Input validation and security headers
- **Performance**: Optimized for low latency and high throughput

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Checklist

- [ ] All functions have proper documentation
- [ ] Error handling implemented
- [ ] Tests added/updated
- [ ] Performance impact considered
- [ ] Security implications reviewed

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Find process using port 8080
   lsof -i :8080

   # Kill the process
   kill -9 <PID>
   ```

2. **Memory Issues**

   ```bash
   # Monitor memory usage
   go tool pprof http://localhost:8080/debug/pprof/heap
   ```

3. **High CPU Usage**
   ```bash
   # Profile CPU usage
   go tool pprof http://localhost:8080/debug/pprof/profile
   ```

### Debugging

```bash
# Run with debug logging
LOG_LEVEL=debug go run main.go

# Enable race detection
go run -race main.go

# Build with debug symbols
go build -gcflags="-N -l" main.go
```

## 📈 Monitoring

### Health Monitoring

The service exposes several monitoring endpoints:

- `/health` - Basic health check
- `/metrics` - Prometheus metrics (when enabled)
- `/debug/pprof/` - Go profiling endpoints

### Logging

Logs are structured and include:

- Request ID for tracing
- Response times
- Error context
- Performance metrics

## 🔐 Security

### Security Measures

- **Input Validation**: All inputs validated and sanitized
- **Rate Limiting**: DoS protection with request size limits
- **Security Headers**: OWASP recommended security headers
- **Timeout Protection**: Request and connection timeouts
- **Error Handling**: No sensitive information in error responses

### Security Headers Added

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Access-Control-Allow-Origin: *` (configurable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Modern Portfolio Theory implementation
- Go community for best practices
- DeFi community for use cases and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/valkryiefinance/valkyrie-finance/issues)
- **Documentation**: [Docs Site](https://docs.valkryiefinance.com)
- **Community**: [Discord](https://discord.gg/valkryiefinance)

---

**Made with ❤️ by the Valkyrie Finance Team**
