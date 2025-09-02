import {
  HiOutlineArrowUp,
  HiOutlineDocument,
  HiOutlineFolder,
} from "react-icons/hi";
import type FileItem from "../../core/FileItem";

interface FileBrowserProps {
  currentPath: string;
  items: FileItem[];
  onFileSelect: (path: string) => void;
  onDirectoryChange: (path: string) => void;
}

export default function FileBrowser({
  currentPath,
  items,
  onFileSelect,
  onDirectoryChange,
}: FileBrowserProps) {
  const handleUpDirectory = () => {
    if (currentPath === "/") {
      return;
    }

    const parentPath =
      currentPath.substring(0, currentPath.lastIndexOf("/")) || "/";
    onDirectoryChange(parentPath);
  };

  const handleItemClick = (item: FileItem) => {
    const newPath = `${currentPath === "/" ? "" : currentPath}/${item.name}`;

    if (item.isDirectory) {
      onDirectoryChange(newPath);
    } else {
      onFileSelect(newPath);
    }
  };

  return (
    <div className="bg-gray-800 flex flex-col h-full">
      <div className="flex items-center p-3 border-b border-gray-700 flex-shrink-0">
        <button
          type="button"
          onClick={handleUpDirectory}
          disabled={currentPath === "/"}
          className="cursor-pointer p-1 px-2 mr-3 text-lg text-gray-400 border border-gray-600 rounded-md hover:border-sky-400 hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-600 disabled:hover:text-gray-400"
        >
          <HiOutlineArrowUp size={18} />
        </button>
        <span className="text-sm text-gray-400 truncate" title={currentPath}>
          {currentPath}
        </span>
      </div>
      <ul className="list-none p-0 m-0 overflow-y-auto flex-grow">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-700/50 border-b border-gray-900"
            onClick={() => {
              handleItemClick(item);
            }}
            onDoubleClick={() => {
              handleItemClick(item);
            }}
          >
            <span className="mr-3 text-gray-400">
              {item.isDirectory ? (
                <HiOutlineFolder size={20} />
              ) : (
                <HiOutlineDocument size={20} />
              )}
            </span>
            <span className="text-gray-200 truncate">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
