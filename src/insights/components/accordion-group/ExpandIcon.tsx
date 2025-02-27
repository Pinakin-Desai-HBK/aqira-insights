import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Tooltip from "@mui/material/Tooltip";

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
