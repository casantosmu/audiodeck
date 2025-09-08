package data

type FileItem struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDirectory"`
}

type FileList struct {
	Path  string     `json:"path"`
	Items []FileItem `json:"items"`
}
