import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className || "" }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none"
  }
});

export default NoMaxWidthTooltip;
