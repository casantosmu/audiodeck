package media

import (
	"errors"
	"io"
	"mime"
	"path/filepath"
	"strings"

	"github.com/h2non/filetype/matchers"
)

var (
	ErrUnsupportedMediaType = errors.New("unsupported media type")
)

type Type string

const (
	MP3     Type = "mp3"
	FLAC    Type = "flac"
	WAV     Type = "wav"
	Unknown Type = ""

	headerSize = 261
)

var supportedExtensions = map[string]struct{}{
	".mp3":  {},
	".flac": {},
	".wav":  {},
}

func IsSupportedExtension(name string) bool {
	ext := strings.ToLower(filepath.Ext(name))
	_, ok := supportedExtensions[ext]
	return ok
}

func IsAudioExtension(name string) bool {
	ext := filepath.Ext(name)
	mimeType := mime.TypeByExtension(ext)
	return strings.HasPrefix(mimeType, "audio/")
}

func DetectType(rs io.ReadSeeker) (Type, error) {
	header := make([]byte, headerSize)

	_, err := rs.Read(header)
	if err != nil {
		return Unknown, err
	}

	_, err = rs.Seek(0, io.SeekStart)
	if err != nil {
		return Unknown, err
	}

	if matchers.Mp3(header) {
		return MP3, nil
	}
	if matchers.Flac(header) {
		return FLAC, nil
	}
	if matchers.Wav(header) {
		return WAV, nil
	}

	return Unknown, ErrUnsupportedMediaType
}
