package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
)

type FileItem struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDirectory"`
}

type FileList struct {
	Path  string     `json:"path"`
	Items []FileItem `json:"items"`
}

func (app *application) listFilesHandler(w http.ResponseWriter, r *http.Request) {
	qs := r.URL.Query()
	path := app.readString(qs, "path", ".")

	dir, err := app.mediaRoot.Open(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			app.notFoundResponse(w, r)
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}
	defer dir.Close()

	info, err := dir.Stat()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if !info.IsDir() {
		err := fmt.Errorf("path '%s' is not a directory", path)
		app.badRequestResponse(w, r, err)
		return
	}

	entries, err := dir.ReadDir(-1)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	items := make([]FileItem, 0, len(entries))
	for _, entry := range entries {
		items = append(items, FileItem{
			Name:  entry.Name(),
			IsDir: entry.IsDir(),
		})
	}

	response := FileList{
		Path:  path,
		Items: items,
	}

	err = app.writeJSON(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
