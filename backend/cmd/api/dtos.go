package main

type FileItem struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDirectory"`
}

type FileList struct {
	Path  string     `json:"path"`
	Items []FileItem `json:"items"`
}

type AudioMetadata struct {
	Codec      string  `json:"codec"`
	SampleRate int     `json:"sampleRate"` // in Hz
	Duration   float64 `json:"duration"`   // in seconds
}
