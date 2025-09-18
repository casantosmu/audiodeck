package main

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

//go:embed ui/*
var uiFiles embed.FS

func (app *application) routes() (http.Handler, error) {
	uiFS, err := fs.Sub(uiFiles, "ui")
	if err != nil {
		return nil, err
	}

	router := httprouter.New()

	router.NotFound = http.FileServerFS(uiFS)

	router.HandlerFunc(http.MethodGet, "/v1/files", app.listFilesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/audio", app.getAudioFileHandler)
	router.HandlerFunc(http.MethodGet, "/v1/audio/metadata", app.getAudioMetadataHandler)

	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	return app.recoverPanic(router), nil
}
