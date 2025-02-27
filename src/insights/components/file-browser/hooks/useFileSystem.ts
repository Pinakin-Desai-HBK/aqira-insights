import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { useEffect, useState } from "react";
import { getNavigationPaneDataFromFileSystemData } from "../helpers/get-navigation-pane-data-from-file-system-data/get-navigation-pane-data-from-file-system-data";
import { useGetFolderContentsQuery } from "src/insights/redux/api/appApi";
import {
  FileSystemContentFileFilter,
  FileSystemContentType,
  UseFileSystemData
} from "src/insights/redux/types/ui/fileBrowser";

const useFileSystem = (
  folderPath: string | null,
  contentType: FileSystemContentType,
  contentFileFilter: FileSystemContentFileFilter,
  timestamp: number
): UseFileSystemData => {
  const [folder, setFolder] = useState<TreeViewBaseItem>();
  const { data: files } = useGetFolderContentsQuery({
    folder: folderPath ?? "",
    contentType,
    contentFileFilter,
    timestamp
  });

  useEffect(() => {
    if (files) {
      setFolder(getNavigationPaneDataFromFileSystemData(files));
    }
  }, [files]);

  return {
    folder
  };
};

export default useFileSystem;
