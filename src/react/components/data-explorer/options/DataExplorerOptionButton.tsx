import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataExplorerOptionButtonProps } from "src/react/redux/types/ui/dataExplorer";

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
