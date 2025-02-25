import { SxProps } from "@mui/material";
import { ReactElement } from "react";
import { VersionsData } from "../schemas/about";

export type AboutPanelAccordionProps = {
  name: string;
  idPrefix: string;
  headingText: string;
  content: ReactElement;
  sx?: SxProps;
  sxDetails?: SxProps;
  sxSummary?: SxProps;
  optional?: {
    expanded?: boolean;
    defaultExpanded?: boolean;
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
  };
  showDivider?: boolean;
  sxDivider?: SxProps;
};

export type SoftwareVersionSectionProps = {
  productName: string;
  releaseFromApi: string;
  componentVersions: VersionsData[];
  productVersions: VersionsData[];
};
