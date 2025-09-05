package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()
	router.HandleFunc("/", helloHandler)
	return router
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello world!"))
}
