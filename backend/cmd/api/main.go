package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
)

type features struct {
	enableLogScale bool
}

type application struct {
	logger    *slog.Logger
	mediaRoot *os.Root
	features  features
}

func main() {
	var port int
	var mediaDir string

	flag.IntVar(&port, "port", 4747, "Server port")
	flag.StringVar(&mediaDir, "media-dir", "/", "Root directory for media files")
	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	info, err := os.Stat(mediaDir)
	if err != nil {
		logger.Error("media directory validation failed", "path", mediaDir, "error", err)
		os.Exit(1)
	}
	if !info.IsDir() {
		logger.Error("media path is not a directory", "path", mediaDir)
		os.Exit(1)
	}

	root, err := os.OpenRoot(mediaDir)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	defer root.Close()

	app := &application{
		logger:    logger,
		mediaRoot: root,
		features: features{
			enableLogScale: os.Getenv("ENABLE_LOG_SCALE") == "true",
		},
	}

	srv := &http.Server{
		Addr:     fmt.Sprintf(":%d", port),
		Handler:  app.routes(),
		ErrorLog: slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("starting server", "addr", srv.Addr, "path", mediaDir, "features", app.features)
	err = srv.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}
