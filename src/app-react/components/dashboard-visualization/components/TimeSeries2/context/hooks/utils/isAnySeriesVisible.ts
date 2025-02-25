import { SciChartSurface } from "scichart";

export const isAnySeriesVisible = (chart: SciChartSurface) => {
  return chart.renderableSeries.asArray().reduce((result, series) => {
    return result || series.isVisible;
  }, false);
};
