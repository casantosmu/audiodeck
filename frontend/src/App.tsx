import { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import SpectrogramDisplay from "./components/SpectrogramDisplay/SpectrogramDisplay";

export default function App() {
  const [searchParams] = useSearchParams();
  const selectedFile = searchParams.get("file");

  return (
    <div className="h-dvh bg-white text-gray-900 lg:flex dark:bg-gray-900 dark:text-gray-100">
      <div
        className={`${
          selectedFile ? "hidden" : "block"
        } h-full lg:block lg:w-80 lg:border-r lg:border-gray-200 dark:lg:border-gray-700`}
      >
        <FileBrowser />
      </div>
      <div
        className={`${selectedFile ? "block" : "hidden"} h-full grow lg:block`}
      >
        <SpectrogramDisplay key={selectedFile} />
      </div>

      <Toaster />
    </div>
  );
}
