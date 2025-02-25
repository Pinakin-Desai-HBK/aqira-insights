import { IconButton, Tooltip } from "@mui/material";
import { DataExplorerOptionButtonProps } from "src/redux/types/ui/dataExplorer";

export const DataExplorerOptionButton = ({ ariaLabel, id, children, onClick }: DataExplorerOptionButtonProps) => {
  return (
    <Tooltip title={ariaLabel} disableInteractive>
      <IconButton
        aria-label={ariaLabel}
        sx={{ color: "text.secondary", padding: "4px", "&:hover": { color: "#DDD" } }}
        onClick={onClick}
        data-testid={`AI-data-explorer-option-${id}`}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};
