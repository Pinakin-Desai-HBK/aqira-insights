import { Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const ExpandIcon = ({ title }: { title?: string }) => (
  <Tooltip title={title || "Expand group"} disableInteractive>
    <ArrowForwardIosIcon sx={{ fontSize: "1.0rem" }} />
  </Tooltip>
);

export const CollapseIcon = ({ title }: { title?: string }) => (
  <Tooltip title={title || "Collapse group"} disableInteractive>
    <ArrowForwardIosIcon sx={{ fontSize: "1.0rem" }} />
  </Tooltip>
);
