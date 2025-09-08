package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"
)

// const version = "0.0.0"

type config struct {
	port     int
	mediaDir string
}

type application struct {
	logger    *slog.Logger
	mediaRoot *os.Root
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "Server port")
	flag.StringVar(&cfg.mediaDir, "media-dir", "/", "Root directory for media files")
	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	info, err := os.Stat(cfg.mediaDir)
	if err != nil {
		logger.Error("media directory validation failed", "path", cfg.mediaDir, "error", err)
		os.Exit(1)
	}
	if !info.IsDir() {
		logger.Error("media path is not a directory", "path", cfg.mediaDir)
		os.Exit(1)
	}

	root, err := os.OpenRoot(cfg.mediaDir)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	defer root.Close()

	app := &application{
		logger:    logger,
		mediaRoot: root,
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("starting server", "addr", srv.Addr, "path", cfg.mediaDir)
	err = srv.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}
