import Box from "@mui/material/Box";
import { IndexSelect } from "../Shared/chart/IndexSelect";
import { memo } from "react";
import { HistogramTableFooterProps } from "src/react/redux/types/ui/table";

const HistogramTableFooter = memo(({ histogramTableInfo }: HistogramTableFooterProps) => {
  if (histogramTableInfo.marksData && histogramTableInfo.marksData.marks.length > 1) {
    return (
      <Box marginTop={`${histogramTableInfo.maxMarkCharacters * 7}px`} zIndex={10}>
        <IndexSelect {...histogramTableInfo} visType="Table" />
      </Box>
    );
  } else return null;
});
HistogramTableFooter.displayName = "HistogramTableFooter";

export default HistogramTableFooter;
