import { ApiRefs } from "src/react/redux/types/ui/dataExplorer";
import { copyColumnContentsHandler } from "../utils/copyColumnContentsHandler";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TooltipIcon } from "src/react/components/icon/Icon";
import { RefObject } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

export const ColumnDetailsColumnHeader = ({
  headerLabel,
  field,
  apiRefs
}: {
  headerLabel: string | undefined;
  field: string;
  apiRefs: RefObject<ApiRefs>;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "default",
      height: "100%",
      width: "100%"
    }}
    data-testid={`AI-column-details-${field}-column-header`}
  >
    <Box sx={{ width: "28px" }}></Box>
    <Box sx={{ textAlign: "center", flexGrow: "1" }}> {headerLabel}</Box>
    <Box sx={{ width: "28px", height: "100%", display: "flex", justifyContent: "center" }}>
      <IconButton
        sx={{
          float: "right",
          borderRadius: "50%",
          padding: "4px",
          minWidth: "24px",
          width: "24px",
          "& .MuiTouchRipple-root": { width: "24px" },
          "& span": { margin: 0 },
          "& svg": { width: "16px", height: "16px", color: "#025f7e" }
        }}
        data-testid={`AI-column-details-copy-${field}-column-button`}
        onClick={() => copyColumnContentsHandler(field, apiRefs)}
      >
        <TooltipIcon title={"Copy column to CSV"} tooltipPlacement="top">
          <ContentCopyIcon />
        </TooltipIcon>
      </IconButton>
    </Box>
  </Box>
);
