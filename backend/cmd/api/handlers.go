package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strings"

	"github.com/casantosmu/audiodeck/internal/media"
	"github.com/maruel/natural"
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
		if entry.IsDir() {
			items = append(items, FileItem{
				Name:  entry.Name(),
				IsDir: true,
			})
		} else if media.IsSupportedExtension(entry.Name()) {
			items = append(items, FileItem{
				Name:  entry.Name(),
				IsDir: false,
			})
		}
	}

	sort.Slice(items, func(i, j int) bool {
		a, b := items[i], items[j]
		if a.IsDir != b.IsDir {
			return a.IsDir
		}
		return natural.Less(strings.ToLower(a.Name), strings.ToLower(b.Name))
	})

	response := FileList{
		Path:  path,
		Items: items,
	}

	err = app.writeJSON(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getAudioFileHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		app.badRequestResponse(w, r, errors.New("path parameter is required"))
		return
	}

	file, err := app.mediaRoot.Open(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			app.notFoundResponse(w, r)
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}
	defer file.Close()

	info, err := file.Stat()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	if info.IsDir() {
		err := fmt.Errorf("path '%s' is a directory", path)
		app.badRequestResponse(w, r, err)
		return
	}

	isAudio, err := media.IsSupportedAudioContent(file)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	if !isAudio {
		err := fmt.Errorf("file '%s' is not an audio file", path)
		app.badRequestResponse(w, r, err)
		return
	}

	http.ServeContent(w, r, info.Name(), info.ModTime(), file)
}
