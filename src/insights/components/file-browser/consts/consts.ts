import { TreeViewBaseItem } from "@mui/x-tree-view";

const WINDOWS_FILE_SPARATOR = "\\";
// const UNIX_FILE_SPARATOR = "/";

export const FILE_SEPARATOR = WINDOWS_FILE_SPARATOR;

export const NAVIGATION_PANE_TREE_ROOT: TreeViewBaseItem = { id: "This PC", label: "This PC", children: [] };
