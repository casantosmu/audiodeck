import { useState } from "react";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import SpectrogramDisplay from "./components/SpectrogramDisplay/SpectrogramDisplay";
import useFiles from "./hooks/useFiles";

export default function App() {
  const [currentPath, setCurrentPath] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data, isLoading, isError } = useFiles(currentPath);

  const handleDirectoryChange = (newPath: string) => {
    setCurrentPath(newPath);
    setSelectedFile(null); // Deselect file when changing directory
  };

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="h-dvh w-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 lg:flex overflow-hidden">
      <div
        className={`${
          selectedFile ? "hidden" : "block"
        } h-full w-full lg:block lg:w-80 lg:flex-none lg:border-r lg:border-gray-200 dark:lg:border-gray-700`}
      >
        <FileBrowser
          currentPath={currentPath}
          items={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
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
