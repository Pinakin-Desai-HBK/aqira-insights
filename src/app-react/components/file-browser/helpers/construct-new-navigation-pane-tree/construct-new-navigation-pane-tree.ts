import { TreeViewBaseItem } from "@mui/x-tree-view";
import { v4 as uuid } from "uuid";

/* As it is non-trivial to update a nested state this function manipulates strings to create the new state */
export const constructNewNavigationPaneTree = (
  folder: TreeViewBaseItem,
  currentTree: TreeViewBaseItem
): TreeViewBaseItem => {
  const newFolderStr = JSON.stringify(folder);
  const emptyFolder = { id: folder.id, label: folder.label, children: [{ id: uuid(), label: "" }] };
  const emptyFolderStr = JSON.stringify(emptyFolder);
  const navigationPaneTreeStr = JSON.stringify(currentTree);
  const indexOfId = navigationPaneTreeStr.indexOf(JSON.stringify(folder.id));
  const indexOfStartOfFolder = indexOfId - 6;

  // Get the string up to the folder
  const newNavigationPaneTreeStr1 = navigationPaneTreeStr.slice(0, indexOfStartOfFolder);

  // Get the string from the empty folder
  const newNavigationPaneTreeStr2 = navigationPaneTreeStr.slice(indexOfStartOfFolder + emptyFolderStr.length);

  // Combine those two strings with the new folder string for the new state
  return JSON.parse(newNavigationPaneTreeStr1 + newFolderStr + newNavigationPaneTreeStr2);
};
