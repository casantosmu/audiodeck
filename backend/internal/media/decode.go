package media

import (
	"fmt"
	"io"

	"github.com/gopxl/beep/v2"
	"github.com/gopxl/beep/v2/flac"
	"github.com/gopxl/beep/v2/mp3"
	"github.com/gopxl/beep/v2/wav"
)

type Metadata struct {
	Codec      string
	SampleRate int     // in Hz
	Duration   float64 // in seconds
}

func GetMetadata(rsc io.ReadSeekCloser) (Metadata, error) {
	mediaType, err := DetectType(rsc)
	if err != nil {
		return Metadata{}, err
	}

	var (
		streamer  beep.StreamSeekCloser
		format    beep.Format
		codec     string
		decodeErr error
	)

	switch mediaType {
	case MP3:
		streamer, format, decodeErr = mp3.Decode(rsc)
		codec = "MP3"
	case FLAC:
		streamer, format, decodeErr = flac.Decode(rsc)
		codec = "FLAC"
	case WAV:
		streamer, format, decodeErr = wav.Decode(rsc)
		codec = "WAV"
	default:
		return Metadata{}, fmt.Errorf("%w for decoding: %s", ErrUnsupportedMediaType, mediaType)
	}

	if decodeErr != nil {
		return Metadata{}, decodeErr
	}
	defer streamer.Close()

	metadata := Metadata{
		Codec:      codec,
		SampleRate: int(format.SampleRate),
		Duration:   format.SampleRate.D(streamer.Len()).Seconds(),
	}

	return metadata, nil
}
