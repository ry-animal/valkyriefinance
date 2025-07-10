// Package monitoring provides monitoring and observability features for the AI engine
package monitoring

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
)

// Log level constants for convenience
const (
	LevelDebug   = sentry.LevelDebug
	LevelInfo    = sentry.LevelInfo
	LevelWarning = sentry.LevelWarning
	LevelError   = sentry.LevelError
	LevelFatal   = sentry.LevelFatal
)

// SentryMonitor wraps Sentry functionality for the AI engine
type SentryMonitor struct {
	initialized bool
}

// NewSentryMonitor creates a new Sentry monitor instance
func NewSentryMonitor() *SentryMonitor {
	return &SentryMonitor{}
}

// Initialize sets up Sentry with appropriate configuration
func (s *SentryMonitor) Initialize() error {
	dsn := os.Getenv("SENTRY_DSN")
	if dsn == "" {
		log.Println("SENTRY_DSN not set, skipping Sentry initialization")
		return nil
	}

	environment := os.Getenv("ENVIRONMENT")
	if environment == "" {
		environment = "development"
	}

	release := os.Getenv("RELEASE_VERSION")
	if release == "" {
		release = "1.0.0"
	}

	err := sentry.Init(sentry.ClientOptions{
		Dsn:              dsn,
		Environment:      environment,
		Release:          release,
		EnableTracing:    true,
		TracesSampleRate: 0.1, // 10% of transactions
		BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
			// Filter out low-level errors in development
			if environment == "development" && event.Level == sentry.LevelWarning {
				return nil
			}
			return event
		},
	})

	if err != nil {
		log.Printf("Failed to initialize Sentry: %v", err)
		return err
	}

	s.initialized = true
	log.Printf("Sentry initialized for environment: %s, release: %s", environment, release)
	return nil
}

// CaptureError captures an error with additional context
func (s *SentryMonitor) CaptureError(err error, tags map[string]string, extra map[string]interface{}) {
	if !s.initialized {
		log.Printf("Error (Sentry not initialized): %v", err)
		return
	}

	sentry.WithScope(func(scope *sentry.Scope) {
		// Add tags
		for key, value := range tags {
			scope.SetTag(key, value)
		}

		// Add extra context
		for key, value := range extra {
			scope.SetExtra(key, value)
		}

		// Set component context
		scope.SetTag("component", "ai-engine")
		scope.SetTag("language", "go")

		sentry.CaptureException(err)
	})
}

// CaptureMessage captures a message with level and context
func (s *SentryMonitor) CaptureMessage(message string, level sentry.Level, tags map[string]string) {
	if !s.initialized {
		log.Printf("Message (Sentry not initialized): %s", message)
		return
	}

	sentry.WithScope(func(scope *sentry.Scope) {
		// Add tags
		for key, value := range tags {
			scope.SetTag(key, value)
		}

		scope.SetTag("component", "ai-engine")
		scope.SetTag("language", "go")

		sentry.CaptureMessage(message)
	})
}

// StartTransaction starts a new Sentry transaction for performance monitoring
func (s *SentryMonitor) StartTransaction(name, operation string) *sentry.Span {
	if !s.initialized {
		return nil
	}

	transaction := sentry.StartTransaction(
		context.Background(),
		name,
		sentry.WithOpName(operation),
	)

	transaction.SetTag("component", "ai-engine")
	transaction.SetTag("operation", operation)

	return transaction
}

// SetUser sets user context for Sentry events
func (s *SentryMonitor) SetUser(userID, email string, extra map[string]interface{}) {
	if !s.initialized {
		return
	}

	sentry.ConfigureScope(func(scope *sentry.Scope) {
		user := sentry.User{
			ID:    userID,
			Email: email,
		}

		// Add extra fields as tags since User struct doesn't have Extra field
		for key, value := range extra {
			scope.SetTag("user_"+key, fmt.Sprintf("%v", value))
		}

		scope.SetUser(user)
	})
}

// Flush flushes pending events to Sentry
func (s *SentryMonitor) Flush(timeout time.Duration) bool {
	if !s.initialized {
		return true
	}

	return sentry.Flush(timeout)
}

// Close cleans up Sentry resources
func (s *SentryMonitor) Close() {
	if s.initialized {
		sentry.Flush(2 * time.Second)
	}
}

// Global instance for easy access
var defaultMonitor = NewSentryMonitor()

// InitializeSentry initializes the global Sentry monitor
func InitializeSentry() error {
	return defaultMonitor.Initialize()
}

// CaptureError captures an error using the global monitor
func CaptureError(err error, tags map[string]string, extra map[string]interface{}) {
	defaultMonitor.CaptureError(err, tags, extra)
}

// CaptureMessage captures a message using the global monitor
func CaptureMessage(message string, level sentry.Level, tags map[string]string) {
	defaultMonitor.CaptureMessage(message, level, tags)
}

// StartTransaction starts a transaction using the global monitor
func StartTransaction(name, operation string) *sentry.Span {
	return defaultMonitor.StartTransaction(name, operation)
}

// SetUser sets user context using the global monitor
func SetUser(userID, email string, extra map[string]interface{}) {
	defaultMonitor.SetUser(userID, email, extra)
}

// Flush flushes pending events using the global monitor
func Flush(timeout time.Duration) bool {
	return defaultMonitor.Flush(timeout)
}

// Close cleans up using the global monitor
func Close() {
	defaultMonitor.Close()
}
