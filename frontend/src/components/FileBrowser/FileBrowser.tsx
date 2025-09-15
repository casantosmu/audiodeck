import {
  HiOutlineArrowUp,
  HiOutlineDocument,
  HiOutlineExclamation,
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
        <div className="flex flex-grow flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Loading...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-grow flex-col items-center justify-center text-red-700 dark:text-red-400">
          <HiOutlineExclamation size={48} className="mb-2" />
          <p className="text-center">Error loading directory.</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-grow flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <HiOutlineFolderOpen size={48} className="mb-2" />
          <p>This directory is empty.</p>
        </div>
      );
    }

    return (
      <ul className="m-0 list-none overflow-y-auto p-0">
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
              className="flex w-full items-center p-3 hover:bg-gray-100 focus:ring-2 focus:ring-sky-500 focus:outline-none focus:ring-inset dark:hover:bg-gray-700/50"
            >
              <span className="mr-3 text-gray-500 dark:text-gray-400">
                {item.isDirectory ? (
                  <HiOutlineFolder size={20} aria-hidden="true" />
                ) : (
                  <HiOutlineDocument size={20} aria-hidden="true" />
                )}
              </span>
              <span className="truncate text-gray-900 dark:text-gray-200">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-800">
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
        <h1 className="truncate text-sm text-gray-500 dark:text-gray-400">
          {"/" + currentPath}
        </h1>
      </TopBar>
      {renderContent()}
    </div>
  );
}
