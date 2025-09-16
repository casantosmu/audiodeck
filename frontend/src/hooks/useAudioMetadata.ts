import { useQuery } from "@tanstack/react-query";
import type ApiError from "../core/ApiError";
import type AudioMetadata from "../core/AudioMetadata";

const fetchAudioMetadata = async (path: string) => {
  const params = new URLSearchParams({ path });
  const response = await fetch(`/v1/audio/metadata?${params.toString()}`);

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.error);
  }

  const data = (await response.json()) as AudioMetadata;
  return data;
};

export default function useAudioMetadata(filePath: string | null) {
  return useQuery({
    queryKey: ["audioMetadata", filePath],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => fetchAudioMetadata(filePath!),
    enabled: !!filePath,
  });
}
