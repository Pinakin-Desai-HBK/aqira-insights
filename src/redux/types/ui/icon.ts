import { TooltipProps } from "@mui/material/Tooltip";
import { CSSProperties, ReactElement } from "react";

type CSSModuleClasses = { readonly [key: string]: string };

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
