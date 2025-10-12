import { useEffect, useState } from "react";

export type SpectrogramScale = "logarithmic" | "linear";

const LOCAL_STORAGE_KEY = "spectrogramScale";

const getInitialScale = (): SpectrogramScale => {
  const storedScale = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedScale === "logarithmic" || storedScale === "linear") {
    return storedScale;
  }
  return "linear";
};

export default function useSpectrogramScale() {
  const [scale, setScale] = useState<SpectrogramScale>(getInitialScale);

  const toggleScale = () => {
    setScale((prev) => (prev === "linear" ? "logarithmic" : "linear"));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, scale);
  }, [scale]);

  return { scale, toggleScale };
}
