import { useEffect, useRef, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineExclamationCircle } from "react-icons/hi";
import WaveSurfer from "wavesurfer.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.js";
import useTheme from "../../context/Theme/useTheme";

interface SpectrogramDisplayProps {
  filePath: string | null;
  onClearFile: () => void;
}

type Status = "idle" | "loading" | "ready" | "error";

export default function SpectrogramDisplay({
  filePath,
  onClearFile,
}: SpectrogramDisplayProps) {
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] = useState<Status>("idle");

  const fileName = filePath?.split("/").pop();

  useEffect(() => {
    if (!filePath || !containerRef.current || !wrapperRef.current) {
      return;
    }

    setStatus("loading");

    const calculatedHeight = wrapperRef.current.clientHeight;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 0,
      url: `/v1/audio?path=${encodeURIComponent(filePath)}`,
      plugins: [
        Spectrogram.create({
          labels: true,
          height: calculatedHeight > 0 ? calculatedHeight : 256,
        }),
      ],
    });

    ws.on("ready", () => {
      setStatus("ready");
    });
    ws.on("error", () => {
      setStatus("error");
    });
    ws.on("loading", () => {
      setStatus("loading");
    });

    return () => {
      ws.destroy();
    };
  }, [filePath, theme]);

  if (!filePath) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 h-full hidden lg:flex justify-center items-center">
        <span className="text-gray-400 dark:text-gray-500 text-lg">
          Select an audio file to analyze
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 h-full flex flex-col">
      <div className="flex items-center gap-x-4 p-5 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClearFile}
          className="cursor-pointer p-2 text-lg text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-sky-700 hover:text-sky-700 dark:hover:border-sky-400 dark:hover:text-sky-400 lg:hidden"
        >
          <HiOutlineArrowLeft size={18} />
        </button>
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400 truncate">
          {fileName}
        </h2>
      </div>

      <div
        ref={wrapperRef}
        className="flex-grow m-2 lg:m-5 rounded-lg overflow-hidden relative"
      >
        <div className="w-full h-full overflow-x-auto">
          <div
            ref={containerRef}
            className={`h-full bg-gray-100 dark:bg-black ${
              status === "ready" ? "min-w-[800px]" : ""
            }`}
            aria-label="Spectrogram"
          />
        </div>
        {status === "loading" && (
          <div className="absolute inset-0 bg-gray-500/30 flex items-center justify-center">
            <p className="text-white text-xl font-bold">Loading audio...</p>
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center p-4 text-center">
            <HiOutlineExclamationCircle
              className="h-12 w-12 text-red-500 dark:text-red-400 mb-3"
              aria-hidden="true"
            />
            <p className="text-lg font-semibold text-red-700 dark:text-red-300">
              Error Loading Audio File
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              The file may be corrupt or in an unsupported format.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
