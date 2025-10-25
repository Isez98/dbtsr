package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"dbtsr.isez.dev/internal/domain"
	_ "github.com/lib/pq"
)

type config struct {
	port int
	env string
	db struct {
		dsn string
	}
}

type application struct {
	config config
	logger *slog.Logger
	models domain.Models
}

func main() {
	var cfg config

  flag.IntVar(&cfg.port, "port", 4000, "API server port")
  flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.db.dsn, "db-dsn", os.Getenv("DBTSR_DB_DSN"), "PostgreSQL DSN")
  flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

	db, err := openDB(cfg)
	if err != nil {
		logger.Error("Error opening database connection", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	logger.Info("Database connection pool established")

	app := &application{
		config: cfg,
		logger: logger,
		models: domain.NewModels(db),
	}

	// Create HTTP server with timeouts and configuration
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(), // chi router as handler
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("Starting server", "addr", srv.Addr, "env", cfg.env)

	err = srv.ListenAndServe()
	if err != nil {
		logger.Error("Server failed to start", "error", err)
		os.Exit(1)
	}
}

func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}
