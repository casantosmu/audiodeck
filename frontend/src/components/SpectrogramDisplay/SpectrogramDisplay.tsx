interface SpectrogramDisplayProps {
  filePath: string | null;
}

export default function SpectrogramDisplay({
  filePath,
}: SpectrogramDisplayProps) {
  if (!filePath) {
    return (
      <div className="bg-gray-800 h-full flex justify-center items-center">
        <span className="text-gray-500 text-lg">
          Select an audio file to analyze
        </span>
      </div>
    );
  }

  const fileName = filePath.split("/").pop();

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-sky-400 truncate">{fileName}</h2>
        <div className="flex gap-x-6 text-sm text-gray-400 mt-2">
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

      <div className="flex-grow bg-black m-5 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
        <div className="text-5xl font-black text-gray-800 tracking-widest select-none">
          SPECTROGRAM
        </div>
      </div>
    </div>
  );
}
