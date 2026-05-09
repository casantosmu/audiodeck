package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
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
		name := entry.Name()
		if entry.IsDir() {
			items = append(items, FileItem{
				Name:        name,
				IsDir:       true,
				IsSupported: true,
			})
		} else if media.IsAudioExtension(name) {
			items = append(items, FileItem{
				Name:        name,
				IsDir:       false,
				IsSupported: media.IsSupportedExtension(name),
			})
		}
	}

	sort.Slice(items, func(i, j int) bool {
		a, b := items[i], items[j]
		if a.IsDir != b.IsDir {
			return a.IsDir
		}
		if a.IsSupported != b.IsSupported {
			return a.IsSupported
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

	mediaType, err := media.DetectType(file)
	if err != nil {
		if errors.Is(err, media.ErrUnsupportedMediaType) {
			err := fmt.Errorf("unsupported media type for file: %s", path)
			app.badRequestResponse(w, r, err)
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}

	switch mediaType {
	case media.FLAC:
		w.Header().Set("Content-Type", "audio/flac")
	case media.MP3:
		w.Header().Set("Content-Type", "audio/mpeg")
	case media.WAV:
		w.Header().Set("Content-Type", "audio/wav")
	}
	w.Header().Set("Cache-Control", "no-cache")
	http.ServeContent(w, r, info.Name(), info.ModTime(), file)
}

func (app *application) getAudioPCMHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		app.badRequestResponse(w, r, ErrPathParamRequired)
		return
	}

        app.logger.Info("PCM fallback requested", "path", path)

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

	cmd := exec.CommandContext(
		r.Context(),
		"ffmpeg",
		"-hide_banner",
		"-loglevel", "error",
		"-i", "pipe:0",
		"-vn",
		"-f", "wav",
		"-acodec", "pcm_s16le",
		"-",
	)

	stdin, err := cmd.StdinPipe()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Start(); err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	go func() {
		_, _ = io.Copy(stdin, file)
		_ = stdin.Close()
	}()

	w.Header().Set("Content-Type", "audio/wav")
	w.Header().Set("Cache-Control", "no-cache")

	_, copyErr := io.Copy(w, stdout)
	waitErr := cmd.Wait()
	if copyErr != nil {
		app.logger.Error("streaming transcoded audio failed", "path", path, "error", copyErr)
		return
	}
	if waitErr != nil {
		app.logger.Error("ffmpeg transcode failed", "path", path, "error", waitErr, "stderr", strings.TrimSpace(stderr.String()))
	}
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

func (app *application) getFeaturesHandler(w http.ResponseWriter, r *http.Request) {
	response := Features{
		EnableLogScale: app.features.enableLogScale,
	}

	err := writeJSON(w, http.StatusOK, response)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
