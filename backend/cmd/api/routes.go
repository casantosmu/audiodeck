package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.FileServer(http.Dir("./web"))

	router.HandlerFunc(http.MethodGet, "/v1/files", app.listFilesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/audio", app.getAudioFileHandler)
	router.HandlerFunc(http.MethodGet, "/v1/audio/metadata", app.getAudioMetadataHandler)
	router.HandlerFunc(http.MethodGet, "/v1/features", app.getFeaturesHandler)

	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	return app.recoverPanic(router)
}
