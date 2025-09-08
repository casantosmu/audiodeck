package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/files", app.listFilesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/audio", app.getAudioFileHandler)

	return app.recoverPanic(router)
}
