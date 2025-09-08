package main

import (
	"net/http"

	"github.com/casantosmu/audiodeck/internal/data"
)

func (app *application) listFilesHandler(w http.ResponseWriter, r *http.Request) {
	data := data.FileList{
		Path: "/FLAC/Artist A",
		Items: []data.FileItem{
			{
				Name:  "Album 1",
				IsDir: true,
			},
			{
				Name:  "cover.jpg",
				IsDir: false,
			},
		},
	}

	err := app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
