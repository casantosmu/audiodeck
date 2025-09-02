import { HiOutlineArrowLeft } from "react-icons/hi";

interface SpectrogramDisplayProps {
  filePath: string | null;
  onClearFile: () => void;
}

export default function SpectrogramDisplay({
  filePath,
  onClearFile,
}: SpectrogramDisplayProps) {
  if (!filePath) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 h-full hidden lg:flex justify-center items-center">
        <span className="text-gray-400 dark:text-gray-500 text-lg">
          Select an audio file to analyze
        </span>
      </div>
    );
  }

  const fileName = filePath.split("/").pop();

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

        <div className="truncate">
          <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400 truncate">
            {fileName}
          </h2>
          <div className="flex flex-wrap gap-x-6 text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>
              <strong>Codec:</strong> FLAC
            </span>
            <span>
              <strong>Bitrate:</strong> 986 kbps
            </span>
            <span>
              <strong>Sample Rate:</strong> 44.1 kHz
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-gray-100 dark:bg-black m-2 lg:m-5 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
        <div className="text-3xl lg:text-5xl font-black text-gray-300 dark:text-gray-800 tracking-widest select-none text-center p-4 break-all">
          SPECTROGRAM
        </div>
      </div>
    </div>
  );
}
