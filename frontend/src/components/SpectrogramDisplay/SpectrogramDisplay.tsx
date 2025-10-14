import { useEffect, useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiOutlineArrowLeft, HiOutlineExclamationCircle } from "react-icons/hi";
import { useSearchParams } from "react-router";
import WaveSurfer from "wavesurfer.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.js";
import useAudioMetadata from "../../hooks/useAudioMetadata";
import useSpectrogramScale from "../../hooks/useSpectrogramScale";
import { formatDuration } from "../../utils/formatDuration";
import IconLink from "../Button/IconLink";
import TopBar from "../TopBar/TopBar";

type Status = "idle" | "loading" | "ready" | "error";

const SLOW_LOAD_THRESHOLD_MS = 15_000;

export default function SpectrogramDisplay() {
  const [searchParams] = useSearchParams();
  const filePath = searchParams.get("file");
  const currentPath = searchParams.get("path") ?? "";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  const { data: metadata } = useAudioMetadata(filePath);
  const { scale, toggleScale } = useSpectrogramScale();

  useEffect(() => {
    if (
      !filePath ||
      !metadata ||
      !containerRef.current ||
      !wrapperRef.current
    ) {
      return;
    }

    setStatus("loading");
    setIsSlowLoad(false);

    const slowLoadTimer = setTimeout(() => {
      setIsSlowLoad(true);
    }, SLOW_LOAD_THRESHOLD_MS);

    const calculatedHeight = wrapperRef.current.clientHeight;

    const spectrogramPlugin = Spectrogram.create({
      labels: true,
      height: calculatedHeight,
      useWebWorker: true,
      scale,
    });

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      height: 0,
      url: `/v1/audio?path=${encodeURIComponent(filePath)}`,
      sampleRate: metadata.sampleRate,
      plugins: [spectrogramPlugin],
      interact: false,
      autoplay: false,
    });

    spectrogramPlugin.on("ready", () => {
      setStatus("ready");
      clearTimeout(slowLoadTimer);
    });

    waveSurfer.on("error", (error) => {
      // This error is triggered on component unmount, we can safely ignore it.
      if (error.name === "AbortError") {
        return;
      }
      setStatus("error");
      clearTimeout(slowLoadTimer);
    });

    return () => {
      clearTimeout(slowLoadTimer);
      waveSurfer.destroy();
    };
  }, [filePath, metadata, scale]);

  if (!filePath) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-50 text-lg text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        Select an audio file to analyze
      </div>
    );
  }

  const fileName = filePath.split("/").pop();

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-800">
      <TopBar
        startContent={
          <IconLink
            to={`?path=${encodeURIComponent(currentPath)}`}
            aria-label="Go back to file list"
            className="lg:hidden"
          >
            <HiOutlineArrowLeft size={18} />
          </IconLink>
        }
      >
        <h2 className="truncate text-lg font-semibold text-sky-700 dark:text-sky-400">
          {fileName}
        </h2>
      </TopBar>

      {metadata && (
        <div className="flex justify-around border-b border-gray-200 bg-gray-100/50 p-2 text-center text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
          <div>
            <span className="font-bold">Codec:</span> {metadata.codec}
          </div>
          <div>
            <span className="font-bold">Sample Rate:</span>{" "}
            {(metadata.sampleRate / 1000).toFixed(1)} kHz
          </div>
          <div>
            <span className="font-bold">Duration:</span>{" "}
            {formatDuration(metadata.duration)}
          </div>
        </div>
      )}

      <div
        ref={wrapperRef}
        className="relative m-2 flex-grow overflow-hidden rounded-lg"
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={toggleScale}
            className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-black/50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
            aria-label={`Switch to ${scale === "linear" ? "logarithmic" : "linear"} scale`}
          >
            {scale === "linear" ? "LIN" : "LOG"}
          </button>
        </div>
        <div
          ref={containerRef}
          className={`h-full overflow-x-auto bg-gray-100 transition-opacity dark:bg-black ${status === "ready" ? "opacity-100" : "opacity-0"}`}
          aria-label="Spectrogram"
        ></div>
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-800">
            <CgSpinner
              className="mb-4 h-8 w-8 animate-spin text-sky-500 dark:text-sky-400"
              aria-hidden="true"
            />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Generating spectrogram...
            </p>
            {scale === "logarithmic" && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Logarithmic scale can take a bit longer.
              </p>
            )}
            {isSlowLoad && (
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                Loading is taking a while due to a large file or slow
                connection...
              </p>
            )}
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-800">
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
