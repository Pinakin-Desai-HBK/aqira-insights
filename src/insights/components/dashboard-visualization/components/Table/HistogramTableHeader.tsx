import Box from "@mui/material/Box";
import { ChannelSelect } from "../Shared/chart/ChannelSelect";
import { memo } from "react";
import { HistogramTableHeaderProps } from "src/insights/redux/types/ui/table";

const HistogramTableHeader = memo(({ histogramTableInfo }: HistogramTableHeaderProps) => {
  return (
    <Box margin={1}>
      <ChannelSelect {...histogramTableInfo} />
    </Box>
  );
});
HistogramTableHeader.displayName = "HistogramTableHeader";

export default HistogramTableHeader;
