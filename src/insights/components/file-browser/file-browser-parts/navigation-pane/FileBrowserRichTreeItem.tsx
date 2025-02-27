import clsx from "clsx";
import { useTreeItemState, TreeItemContentProps } from "@mui/x-tree-view/TreeItem";
import { forwardRef } from "react";
import Box from "@mui/material/Box";
import FolderIcon from "@mui/icons-material/Folder";

export const FileBrowserRichTreeItem = forwardRef(function FileBrowserRichTreeItemMemo(
  props: TreeItemContentProps,
  ref
) {
  const { classes, className, label, itemId, icon: iconProp, expansionIcon, displayIcon } = props;

  const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } =
    useTreeItemState(itemId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleSelection(event);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled
      })}
      onMouseDown={handleMouseDown}
      onClick={handleSelectionClick}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div
        data-testid={`AI-navigation-pane-item-expand-${label}`}
        onClick={handleExpansionClick}
        className={classes.iconContainer}
      >
        {icon}
      </div>
      <Box display="flex" alignItems="end" gap={0.5}>
        <FolderIcon />
        <span
          data-testid={`AI-navigation-pane-item-label-${label}`}
          style={{ fontSize: "0.875rem", whiteSpace: "nowrap" }}
        >
          {label}
        </span>
      </Box>
    </div>
  );
});
