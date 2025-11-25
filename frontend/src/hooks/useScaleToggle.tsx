import { useEffect, useState } from "react";
import type Features from "../core/Features";

export type SpectrogramScale = "logarithmic" | "linear";

const LOCAL_STORAGE_KEY = "spectrogramScale";

const getInitialScale = (): SpectrogramScale => {
  const storedScale = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedScale === "logarithmic" || storedScale === "linear") {
    return storedScale;
  }
  return "linear";
};

/**
 * Manages the spectrogram scale toggle (linear/logarithmic).
 *
 * The logarithmic scale feature is hidden by default due to performance
 * and reliability issues. It can be enabled via the ENABLE_LOG_SCALE
 * environment variable for users who want to opt-in.
 */
export default function useScaleToggle(features?: Features) {
  const [scale, setScale] = useState<SpectrogramScale>(getInitialScale);

  const isEnabled = features?.enableLogScale ?? false;
  const effectiveScale = isEnabled ? scale : "linear";

  const toggleScale = () => {
    setScale((prev) => (prev === "linear" ? "logarithmic" : "linear"));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, scale);
  }, [scale]);

  const ToggleButton = isEnabled ? (
    <button
      type="button"
      onClick={toggleScale}
      className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-black/50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
      aria-label={`Switch to ${effectiveScale === "linear" ? "logarithmic" : "linear"} scale`}
    >
      {effectiveScale === "linear" ? "LIN" : "LOG"}
    </button>
  ) : null;

  return { scale: effectiveScale, ToggleButton };
}
