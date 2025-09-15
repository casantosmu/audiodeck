import { useEffect, useRef, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineExclamationCircle } from "react-icons/hi";
import WaveSurfer from "wavesurfer.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.js";
import IconButton from "../Button/IconButton";
import TopBar from "../TopBar/TopBar";

interface SpectrogramDisplayProps {
  filePath: string | null;
  onClearFile: () => void;
}

type Status = "idle" | "loading" | "ready" | "error";

export default function SpectrogramDisplay({
  filePath,
  onClearFile,
}: SpectrogramDisplayProps) {
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
      sampleRate: 44_100,
      plugins: [
        Spectrogram.create({
          labels: true,
          height: calculatedHeight > 0 ? calculatedHeight : 256,
          useWebWorker: true,
          scale: "linear",
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
  }, [filePath]);

  if (!filePath) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-50 text-lg text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        Select an audio file to analyze
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-800">
      <TopBar
        startContent={
          <IconButton
            type="button"
            onClick={onClearFile}
            aria-label="Go back to file list"
            className="lg:hidden"
          >
            <HiOutlineArrowLeft size={18} />
          </IconButton>
        }
      >
        <h2 className="truncate text-lg font-semibold text-sky-700 dark:text-sky-400">
          {fileName}
        </h2>
      </TopBar>

      <div
        ref={wrapperRef}
        className="m-2 flex-grow overflow-hidden rounded-lg"
      >
        <div
          ref={containerRef}
          className={`h-full overflow-x-auto bg-gray-100 dark:bg-black ${status === "ready" ? "block" : "hidden"}`}
          aria-label="Spectrogram"
        ></div>
        {status === "loading" && (
          <div className="flex h-full flex-col items-center justify-center bg-gray-500/30 text-xl font-bold text-white">
            Loading audio...
          </div>
        )}
        {status === "error" && (
          <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-800">
            <HiOutlineExclamationCircle
              className="mb-3 h-12 w-12 text-red-500 dark:text-red-400"
              aria-hidden="true"
            />
            <p className="text-lg font-semibold text-red-700 dark:text-red-300">
              Error Loading Audio File
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              The file may be corrupt or in an unsupported format.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
