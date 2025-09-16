/**
 * Formats a duration in seconds into a MM:SS string.
 * @param totalSeconds The duration in seconds.
 * @returns A string in MM:SS format.
 */
export function formatDuration(totalSeconds: number): string {
  if (Number.isNaN(totalSeconds) || totalSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const paddedSeconds = String(seconds).padStart(2, "0");

  return minutes.toString() + ":" + paddedSeconds;
}
