package media

import (
	"io"
	"path/filepath"
	"strings"

	"github.com/h2non/filetype"
)

var SupportedAudioExtensions = map[string]struct{}{
	".mp3":  {},
	".m4a":  {},
	".flac": {},
	".wav":  {},
	".ogg":  {},
	".aac":  {},
}

func IsSupportedExtension(name string) bool {
	ext := strings.ToLower(filepath.Ext(name))
	_, ok := SupportedAudioExtensions[ext]
	return ok
}

func IsSupportedAudioContent(file io.ReadSeeker) (bool, error) {
	buffer := make([]byte, 261)
	_, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return false, err
	}

	if _, err = file.Seek(0, io.SeekStart); err != nil {
		return false, err
	}

	return filetype.IsAudio(buffer), nil
}
