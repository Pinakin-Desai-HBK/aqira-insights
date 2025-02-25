import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { FileBrowserRichTreeItem } from "./FileBrowserRichTreeItem";
import { memo } from "react";
import { useTheme } from "@mui/material";
import { FileBrowserNavigationPaneProps } from "src/redux/types/ui/fileBrowser";

export const FileBrowserNavigationPane = memo(function FileBrowserNavigationPaneMemo({
  items,
  expandedItems,
  selectedItems,
  handleItemExpansion,
  handleItemSelection
}: FileBrowserNavigationPaneProps) {
  const theme = useTheme();

  return (
    <RichTreeView
      items={[items]}
      expandedItems={expandedItems}
      selectedItems={selectedItems}
      slotProps={{ item: { ContentComponent: FileBrowserRichTreeItem } }}
      sx={{ borderRight: "1px solid", borderColor: theme.palette.fileBrowser.border, width: "35%", overflowY: "auto" }}
      onItemExpansionToggle={handleItemExpansion}
      onItemSelectionToggle={handleItemSelection}
      defaultExpandedItems={["C:"]}
      defaultSelectedItems={"C:"}
    />
  );
});
