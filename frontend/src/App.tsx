import { useState } from "react";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import SpectrogramDisplay from "./components/SpectrogramDisplay/SpectrogramDisplay";
import type FileItem from "./core/FileItem";

// Simulates a simple file system structure
const mockFileSystem: Record<string, FileItem[]> = {
  "/": [
    { name: "FLAC", isDirectory: true },
    { name: "MP3", isDirectory: true },
    { name: "README.md", isDirectory: false },
  ],
  "/FLAC": [
    { name: "Artist A", isDirectory: true },
    { name: "Artist B", isDirectory: true },
  ],
  "/FLAC/Artist A": [{ name: "Album 1", isDirectory: true }],
  "/FLAC/Artist A/Album 1": [
    { name: "01 - Song One.flac", isDirectory: false },
    { name: "02 - Song Two.flac", isDirectory: false },
  ],
  "/MP3": [{ name: "Podcast Episode.mp3", isDirectory: false }],
};

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const itemsForCurrentPath = mockFileSystem[currentPath] ?? [];

  const handleDirectoryChange = (newPath: string) => {
    if (mockFileSystem[newPath]) {
      setCurrentPath(newPath);
      setSelectedFile(null); // Deselect file when changing directory
    }
  };

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="h-dvh w-screen bg-gray-900 text-gray-100 lg:flex">
      <div
        className={`${
          selectedFile ? "hidden" : "block"
        } h-full w-full lg:block lg:w-80 lg:flex-none lg:border-r lg:border-gray-700`}
      >
        <FileBrowser
          currentPath={currentPath}
          items={itemsForCurrentPath}
          onDirectoryChange={handleDirectoryChange}
          onFileSelect={handleFileSelect}
        />
      </div>
      <div
        className={`${
          selectedFile ? "block" : "hidden"
        } h-full w-full lg:block lg:flex-1`}
      >
        <SpectrogramDisplay
          filePath={selectedFile}
          onClearFile={handleClearFile}
        />
      </div>
    </div>
  );
}
