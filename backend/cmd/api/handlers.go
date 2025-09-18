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

var (
	ErrPathParamRequired = errors.New("path parameter is required")
)

func (app *application) listFilesHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		path = "."
	}

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

	err = writeJSON(w, http.StatusOK, response)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getAudioFileHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		app.badRequestResponse(w, r, ErrPathParamRequired)
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

	_, err = media.DetectType(file)
	if err != nil {
		if errors.Is(err, media.ErrUnsupportedMediaType) {
			err := fmt.Errorf("unsupported media type for file: %s", path)
			app.badRequestResponse(w, r, err)
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}

	http.ServeContent(w, r, info.Name(), info.ModTime(), file)
}

func (app *application) getAudioMetadataHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		app.badRequestResponse(w, r, ErrPathParamRequired)
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

	metadata, err := media.GetMetadata(file)
	if err != nil {
		if errors.Is(err, media.ErrUnsupportedMediaType) {
			err := fmt.Errorf("unsupported media type for file: %s", path)
			app.badRequestResponse(w, r, err)
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}

	response := AudioMetadata{
		Codec:      metadata.Codec,
		SampleRate: metadata.SampleRate,
		Duration:   metadata.Duration,
	}

	err = writeJSON(w, http.StatusOK, response)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
