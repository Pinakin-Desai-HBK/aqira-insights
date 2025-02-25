import { Box, IconButton } from "@mui/material";
import {
  GridFilterAltIcon,
  GridSlotsComponentsProps,
  GridToolbarContainer,
  GridToolbarFilterButton
} from "@mui/x-data-grid";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TooltipIcon } from "src/components/icon/Icon";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    copyTableContentsHandler: () => void;
    setFilterButtonEl: (el: HTMLButtonElement | null) => void;
  }
}

export const ColumnDetailsGridToolbar = ({
  setFilterButtonEl,
  copyTableContentsHandler
}: NonNullable<GridSlotsComponentsProps["toolbar"]>) => {
  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton
        sx={{
          borderRadius: "50%",
          minWidth: "28px",
          "& .MuiTouchRipple-root": { width: "28px" },
          "& span": { margin: 0 },
          "& svg": { width: "16px", height: "16px", color: "#025f7e" }
        }}
        data-testid="AI-column-details-copy-table-button"
        onClick={copyTableContentsHandler}
      >
        <TooltipIcon title={"Copy table to CSV"} tooltipPlacement="top">
          <ContentCopyIcon />
        </TooltipIcon>
      </IconButton>
      <GridToolbarFilterButton
        ref={setFilterButtonEl}
        slotProps={{
          tooltip: { title: "Filter" },
          button: {
            color: "primary",
            startIcon: <GridFilterAltIcon data-testid="AI-column-details-filter-button" />,
            sx: {
              borderRadius: "50%",
              minWidth: "28px",
              "& .MuiTouchRipple-root": { width: "28px" },
              "& span": { margin: 0 }
            }
          }
        }}
      />
    </GridToolbarContainer>
  );
};
