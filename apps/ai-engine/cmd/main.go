package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/valkyriefinance/ai-engine/internal/server"
	"github.com/valkyriefinance/ai-engine/internal/services"
)

func main() {
	log.Println("Starting Valkyrie AI Engine...")

	// Initialize data collector
	dataCollector := services.NewRealDataCollector()

	// Initialize enhanced AI engine
	aiEngine := services.NewEnhancedAIEngine()

	// Create HTTP server
	httpServer := server.NewSimpleHTTPServer(aiEngine, dataCollector)

	// Start data collection
	log.Println("Starting data collection...")
	if err := dataCollector.Start(); err != nil {
		log.Fatalf("Failed to start data collector: %v", err)
	}

	// Handle graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		log.Println("Shutting down gracefully...")
		dataCollector.Stop()
		httpServer.Stop()
	}()

	// Start HTTP server
	port := 8080
	log.Printf("Starting HTTP server on port %d...", port)
	if err := httpServer.Start(port); err != nil {
		log.Fatalf("Failed to start HTTP server: %v", err)
	}
}
