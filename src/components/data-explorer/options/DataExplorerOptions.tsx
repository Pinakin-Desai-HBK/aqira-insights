import Box from "@mui/material/Box";
import { memo } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import FolderIcon from "@mui/icons-material/Folder";
import { DataExplorerOptionButton } from "./DataExplorerOptionButton";
import { DataExplorerOptionsProps } from "src/redux/types/ui/dataExplorer";
import { appLabels } from "src/consts/labels";

const labels = appLabels.DataExplorerOptions;

export const DataExplorerOptions = memo(
  ({ onRefresh, onSelectFolder, onSort, showSelectFolder }: DataExplorerOptionsProps) => {
    return (
      <Box sx={{ margin: "8px 8px 4px 0" }} data-testid="AI-data-explorer-options">
        {showSelectFolder ? (
          <DataExplorerOptionButton id="select" ariaLabel={labels.selectFolder} onClick={onSelectFolder}>
            <FolderIcon />
          </DataExplorerOptionButton>
        ) : null}
        <DataExplorerOptionButton id="refresh" ariaLabel={labels.refresh} onClick={onRefresh}>
          <CachedIcon />
        </DataExplorerOptionButton>
        <DataExplorerOptionButton id="sort" ariaLabel={labels.sort} onClick={onSort}>
          <SwapVertIcon />
        </DataExplorerOptionButton>
      </Box>
    );
  }
);
DataExplorerOptions.displayName = "DataExplorerOptions";
