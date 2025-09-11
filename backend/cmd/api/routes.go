package main

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

//go:embed ui/*
var uiFiles embed.FS

func (app *application) routes() http.Handler {
	uiFS, err := fs.Sub(uiFiles, "ui")
	if err != nil {
		panic(err)
	}

	router := httprouter.New()

	router.NotFound = http.Handler(http.FileServer(http.FS(uiFS)))

	router.HandlerFunc(http.MethodGet, "/v1/files", app.listFilesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/audio", app.getAudioFileHandler)

	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	return app.recoverPanic(router)
}
