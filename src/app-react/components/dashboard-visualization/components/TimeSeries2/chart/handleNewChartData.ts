import { NumberRange } from "scichart";
import { ChartData, StoredChartState } from "../types";
import { getYRangeFromData } from "./utils/getYRangeFromData";
import { transferColumnDataToSeries } from "./utils/transferColumnDataToSeries";

export const handleNewChartData = (chartData: ChartData, storedChartState: StoredChartState | null) => {
  const {
    chartSurface,
    overview,
    range,
    fullRange,
    minimapChartColumns,
    chartColumns,
    xySeriesArray,
    minimapXySeriesArray
  } = chartData;

  if (!chartSurface || !overview || !fullRange) return;

  const yRange = getYRangeFromData(minimapChartColumns);
  if (!yRange) return;

  chartSurface.suspendUpdates();
  overview.overviewSciChartSurface.suspendUpdates();
  transferColumnDataToSeries(chartColumns, xySeriesArray);

  if (range) {
    const isStoredRangeInFullRange =
      storedChartState?.range &&
      storedChartState.range.min >= fullRange.min &&
      storedChartState.range.max <= fullRange.max;
    if (isStoredRangeInFullRange) {
      chartSurface.xAxes.get(0).visibleRange = new NumberRange(
        storedChartState.range!.min,
        storedChartState.range!.max
      );
    } else chartSurface.xAxes.get(0).visibleRange = new NumberRange(range.min, range.max);
  }
  chartSurface.xAxes.get(0).visibleRangeLimit = new NumberRange(fullRange.min, fullRange.max);
  chartSurface.xAxes.get(0).zoomExtentsRange = new NumberRange(fullRange.min, fullRange.max);

  transferColumnDataToSeries(minimapChartColumns, minimapXySeriesArray);

  overview.overviewSciChartSurface.yAxes.get(0).visibleRange = yRange;
  overview.overviewSciChartSurface.yAxes.get(0).visibleRangeLimit = yRange;
  overview.overviewSciChartSurface.yAxes.get(0).zoomExtentsRange = yRange;
  overview.overviewSciChartSurface.xAxes.get(0).visibleRangeLimit = new NumberRange(fullRange.min, fullRange.max);
  overview.overviewSciChartSurface.xAxes.get(0).zoomExtentsRange = new NumberRange(fullRange.min, fullRange.max);

  chartSurface.resume();
  overview.overviewSciChartSurface.resume();
};
