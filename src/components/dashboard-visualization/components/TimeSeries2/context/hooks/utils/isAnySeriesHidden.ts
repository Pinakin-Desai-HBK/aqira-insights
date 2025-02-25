import { SciChartSurface } from "scichart";

export const isAnySeriesHidden = (chart: SciChartSurface) => {
  return chart.renderableSeries.asArray().reduce((result, series) => {
    return result || !series.isVisible;
  }, false);
};
