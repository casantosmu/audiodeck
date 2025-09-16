import { useSearchParams } from "react-router";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import SpectrogramDisplay from "./components/SpectrogramDisplay/SpectrogramDisplay";
import useFiles from "./hooks/useFiles";

export default function App() {
  const [searchParams] = useSearchParams();

  const currentPath = searchParams.get("path") ?? "";
  const selectedFile = searchParams.get("file");

  const { data, isLoading, isError } = useFiles(currentPath);

  const backUrl = `?path=${encodeURIComponent(currentPath)}`;

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
        />
      </div>
      <div
        className={`${selectedFile ? "block" : "hidden"} h-full grow lg:block`}
      >
        <SpectrogramDisplay filePath={selectedFile} backUrl={backUrl} />
      </div>
    </div>
  );
}
