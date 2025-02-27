import { styled, tooltipClasses } from "@mui/material";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className || "" }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none"
  }
});

export default NoMaxWidthTooltip;
