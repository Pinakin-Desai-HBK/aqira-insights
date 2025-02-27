import { Bin, ScaleType } from "src/react/components/dashboard-visualization/components/Histogram/types";
import { getClosestToZero } from "./getClosestToZero";
import { TSciChart, XyCustomFilter, XyDataSeries } from "scichart";
import { filter } from "src/react/components/dashboard-visualization/components/Shared/chart/prepare/utils/logFilter";

export const processBinData = ({
  bins,
  yValues,
  scaleType,
  wasmContext
}: {
  bins: Bin[];
  yValues: number[];
  scaleType: ScaleType;
  wasmContext: TSciChart;
}) => {
  const xValues = bins.map((bin) => bin.midPoint);
  // const yValues = bins.map((bin) => bin.y);
  const closestToZero = getClosestToZero(bins);
  const rawDataSeries = new XyDataSeries(wasmContext, { xValues, yValues, containsNaN: false, isSorted: true });
  const dataSeries =
    scaleType === "logarithmic"
      ? new XyCustomFilter(rawDataSeries, { filterFunction: (i, y) => filter({ y, closestToZero }) })
      : rawDataSeries;
  return { dataSeries, closestToZero };
};
