import { useQuery } from "@tanstack/react-query";
import type ApiError from "../core/ApiError";
import type Features from "../core/Features";

const fetchFeatures = async () => {
  const response = await fetch("/v1/features");

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.error);
  }

  const data = (await response.json()) as Features;
  return data;
};

export default function useFeatures() {
  return useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
    staleTime: Infinity,
  });
}
