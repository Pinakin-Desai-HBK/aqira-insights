import { SxProps } from "@mui/material";

export type DetailsGridItem =
  | { type: "label"; key: string; label: string; sxLabel?: SxProps }
  | { type: "data"; key: string; value: string; label: string; sxLabel?: SxProps; sxValue?: SxProps; tooltip?: string };

export type DetailsGridProps = {
  testIdPrefix: string;
  itemsArray: DetailsGridItem[][];
  sx?: SxProps;
};
