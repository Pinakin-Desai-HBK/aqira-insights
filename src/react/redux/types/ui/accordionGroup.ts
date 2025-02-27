import { ReactElement } from "react";
import { GroupToggle } from "./themes";
import { SxProps } from "@mui/material";

export type AccordionGroupProps = {
  name: string;
  heading: ReactElement;
  children: ReactElement | ReactElement[];
  idPrefix: string;
  toggleTheme: GroupToggle;
  sx?: SxProps;
  sxDetails?: SxProps;
  sxSummary?: SxProps;
  overflowY?: string;
  optional?: {
    expanded?: boolean;
    defaultExpanded?: boolean;
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
  };
  showDivider?: boolean;
  sxDivider?: SxProps;
  toggleLabel: string;
};
