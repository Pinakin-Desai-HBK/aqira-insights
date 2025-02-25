import { TreeViewBaseItem } from "@mui/x-tree-view";
import { FileSystemContentItem, FileSystemFolder } from "../../../../redux/types/schemas/fileBrowser";
import { v4 as uuid } from "uuid";
import { NAVIGATION_PANE_TREE_ROOT } from "../../consts/consts";
import { FileSystemItemType } from "src/redux/types/ui/fileBrowser";

export const getNavigationPaneDataFromFileSystemData = (fileSystemData: FileSystemFolder): TreeViewBaseItem => {
  return {
    id: fileSystemData.folderFullName ? fileSystemData.folderFullName : NAVIGATION_PANE_TREE_ROOT.id,
    label: fileSystemData.folderName ? fileSystemData.folderName : NAVIGATION_PANE_TREE_ROOT.id,
    children: fileSystemData.content.map((item: FileSystemContentItem) => {
      const treeItem: TreeViewBaseItem = {
        id: item.fullName,
        label: item.name
      };
      if (item.type === FileSystemItemType.Drive || item.type === FileSystemItemType.Folder)
        treeItem.children = [{ id: uuid(), label: "" }];
      return treeItem;
    })
  };
};
