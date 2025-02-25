import { GetFolderContentsParams } from "src/redux/types/ui/fileBrowser";
import { Timestamp } from "src/redux/types/ui/dataExplorer";

export const getFolderContentsURL = (folderContentsParams: GetFolderContentsParams & Timestamp) => {
  const { contentFileFilter, contentType, folder, timestamp } = folderContentsParams;
  const params = folder
    ? `?Folder=${folder}${contentType ? `&ContentType=${contentType}` : ""}${
        contentFileFilter ? `&ContentFileFilter=${contentFileFilter}` : ""
      }&`
    : "?";
  return `FileSystem/GetFolderContents${params}timestamp=${timestamp}`;
};
