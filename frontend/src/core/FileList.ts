import type FileItem from "./FileItem";

export default interface FileList {
  path: string;
  items: FileItem[];
}
