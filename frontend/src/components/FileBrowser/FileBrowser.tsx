import {
  HiOutlineArrowUp,
  HiOutlineDocument,
  HiOutlineExclamationCircle,
  HiOutlineFolder,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import type FileItem from "../../core/FileItem";
import IconButton from "../Button/IconButton";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import TopBar from "../TopBar/TopBar";

interface FileBrowserProps {
  currentPath: string;
  items: FileItem[];
  isLoading: boolean;
  isError: boolean;
  onFileSelect: (path: string) => void;
  onDirectoryChange: (path: string) => void;
}

export default function FileBrowser({
  currentPath,
  items,
  isLoading,
  isError,
  onFileSelect,
  onDirectoryChange,
}: FileBrowserProps) {
  const handleUpDirectory = () => {
    if (!currentPath) {
      return;
    }
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
    onDirectoryChange(parentPath);
  };

  const handleItemClick = (item: FileItem) => {
    const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
    if (item.isDirectory) {
      onDirectoryChange(newPath);
    } else {
      onFileSelect(newPath);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
          <p>Loading...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col justify-center items-center h-full text-red-700 dark:text-red-400 p-4">
          <HiOutlineExclamationCircle size={48} className="mb-2" />
          <p className="text-center">Error loading directory.</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-full text-gray-500 dark:text-gray-400">
          <HiOutlineFolderOpen size={48} className="mb-2" />
          <p>This directory is empty.</p>
        </div>
      );
    }

    return (
      <ul className="list-none p-0 m-0 overflow-y-auto flex-grow">
        {items.map((item) => (
          <li
            key={item.name}
            className="border-b border-gray-200 dark:border-gray-900"
          >
            <button
              type="button"
              onClick={() => {
                handleItemClick(item);
              }}
              className="flex items-center p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
            >
              <span className="mr-3 text-gray-500 dark:text-gray-400">
                {item.isDirectory ? (
                  <HiOutlineFolder size={20} aria-hidden="true" />
                ) : (
                  <HiOutlineDocument size={20} aria-hidden="true" />
                )}
              </span>
              <span className="text-gray-900 dark:text-gray-200 truncate">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 flex flex-col h-full">
      <TopBar
        startContent={
          <IconButton
            type="button"
            onClick={handleUpDirectory}
            disabled={!currentPath}
            aria-label="Go up one directory"
          >
            <HiOutlineArrowUp size={18} />
          </IconButton>
        }
        endContent={<ThemeSwitcher />}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentPath}
        </span>
      </TopBar>
      {renderContent()}
    </div>
  );
}
