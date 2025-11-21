import { useQuery } from "@tanstack/react-query";
import type ApiError from "../core/ApiError";
import type FileList from "../core/FileList";

const fetchFiles = async (path: string) => {
  const params = new URLSearchParams();
  if (path) {
    params.set("path", path);
  }

  const response = await fetch(`/v1/files?${params.toString()}`);

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.error);
  }

  const data = (await response.json()) as FileList;
  return data;
};

export default function useFiles(path: string) {
  return useQuery({
    queryKey: ["files", path],
    queryFn: () => fetchFiles(path),
  });
}
