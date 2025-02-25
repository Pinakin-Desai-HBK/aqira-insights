import { NumberRange, SciChartSurface } from "scichart";

export const updateYRange = (sciChartSurface: SciChartSurface) => {
  const visibleSeries = sciChartSurface.renderableSeries.asArray().filter((series) => series.isVisible);
  if (visibleSeries.length === 0) return;
  const yAxis = sciChartSurface.yAxes.get(0);
  const yRange = yAxis.getWindowedYRange(undefined);
  const paddedYRange = new NumberRange(yRange.min - yRange.diff * 0.1, yRange.max + yRange.diff * 0.1);
  yAxis.visibleRange = paddedYRange;
};
