import { NumberRange } from "scichart";
import { ChartData } from "../../../../../types";

export const prepareYExtent = ({
  chartData,
  usingBinsYRange,
  equaliseRanges
}: {
  chartData: ChartData;
  usingBinsYRange: boolean;
  equaliseRanges: boolean;
}) => {
  if (!chartData.data) throw Error("No data found");
  const {
    data: { y }, // bins
    allDataMaxY,
    allDataMinY
  } = chartData;
  // const binsMaxY = Math.max(...bins.map((bin) => bin.y));
  // const binsMinY = Math.min(...bins.map((bin) => bin.y));
  const binsMaxY = Math.max(...y);
  const binsMinY = Math.min(...y);
  const maxY = usingBinsYRange ? binsMaxY : allDataMaxY;
  const minY = usingBinsYRange ? binsMinY : allDataMinY;
  const max = Math.max(Math.abs(maxY), Math.abs(minY));
  const preparedMaxY = maxY > 0 ? Math.sign(maxY) * (equaliseRanges ? max : maxY) : 0;
  const preparedMinY = minY < 0 ? Math.sign(minY) * (equaliseRanges ? max : minY) : 0;
  return new NumberRange(preparedMinY, preparedMaxY);
};
