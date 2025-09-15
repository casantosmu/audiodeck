import { useSearchParams } from "react-router";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import SpectrogramDisplay from "./components/SpectrogramDisplay/SpectrogramDisplay";
import useFiles from "./hooks/useFiles";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPath = searchParams.get("path") ?? "";
  const selectedFile = searchParams.get("file");

  const { data, isLoading, isError } = useFiles(currentPath);

  const handleDirectoryChange = (newPath: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("path", newPath);
    newParams.delete("file");
    setSearchParams(newParams);
  };

  const handleFileSelect = (filePath: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("file", filePath);
    setSearchParams(newParams);
  };

  const handleClearFile = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("file");
    setSearchParams(newParams);
  };

  return (
    <div className="h-dvh bg-white text-gray-900 lg:flex dark:bg-gray-900 dark:text-gray-100">
      <div
        className={`${
          selectedFile ? "hidden" : "block"
        } h-full lg:block lg:w-80 lg:border-r lg:border-gray-200 dark:lg:border-gray-700`}
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
        className={`${selectedFile ? "block" : "hidden"} h-full grow lg:block`}
      >
        <SpectrogramDisplay
          filePath={selectedFile}
          onClearFile={handleClearFile}
        />
      </div>
    </div>
  );
}
