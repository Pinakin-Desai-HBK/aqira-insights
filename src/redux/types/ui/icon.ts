import { TooltipProps } from "@mui/material";
import { CSSProperties, ReactElement } from "react";

export type IconProps = {
  src: string;
  alt?: string | undefined;
  style: CSSProperties;
  title?: string;
  inverted?: boolean;
};

export type TooltipIconProps = {
  title: string;
  tooltipPlacement: TooltipProps["placement"];
  classes?: CSSModuleClasses[string] | undefined;
  children: ReactElement;
};
