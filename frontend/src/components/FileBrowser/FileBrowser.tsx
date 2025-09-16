import {
  HiOutlineArrowUp,
  HiOutlineDocument,
  HiOutlineExclamation,
  HiOutlineFolder,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import { useSearchParams } from "react-router";
import useFiles from "../../hooks/useFiles";
import IconLink from "../Button/IconLink";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import TopBar from "../TopBar/TopBar";

const createItemPath = (basePath: string, itemName: string) => {
  return basePath ? `${basePath}/${itemName}` : itemName;
};

export default function FileBrowser() {
  const [searchParams] = useSearchParams();
  const currentPath = searchParams.get("path") ?? "";

  const { data, isLoading, isError } = useFiles(currentPath);
  const items = data?.items ?? [];

  const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));

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
        {items.map((item) => {
          const itemFullPath = createItemPath(currentPath, item.name);
          const to = item.isDirectory
            ? `?path=${encodeURIComponent(itemFullPath)}`
            : `?path=${encodeURIComponent(currentPath)}&file=${encodeURIComponent(itemFullPath)}`;

          return (
            <li
              key={item.name}
              className="border-b border-gray-200 dark:border-gray-900"
            >
              <IconLink
                to={to}
                className="flex w-full items-center rounded-none border-none p-3 hover:bg-gray-100 focus:ring-inset dark:hover:bg-gray-700/50"
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
              </IconLink>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-800">
      <TopBar
        startContent={
          <IconLink
            to={`?path=${encodeURIComponent(parentPath)}`}
            aria-disabled={!currentPath}
            className={!currentPath ? "pointer-events-none" : ""}
            aria-label="Go up one directory"
          >
            <HiOutlineArrowUp size={18} />
          </IconLink>
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
