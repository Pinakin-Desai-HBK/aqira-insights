import { FastColumnRenderableSeries } from "scichart";
import { ChartRefs, HistogramMode } from "../../types";

export const updateSeriesVisibility = (refs: ChartRefs, mode: HistogramMode, binWidth: number) => {
  refs.columnSeries.dataPointWidth = refs.overviewColumnSeries.dataPointWidth = binWidth;
  refs.columnSeries.isVisible = mode === "showBins";
  refs.columnSeries.opacity = mode === "showBins" ? 1 : 0;
  refs.chartSurface.renderableSeries.asArray().forEach((series) => {
    if (series instanceof FastColumnRenderableSeries) {
      series.isVisible = mode === "showBins";
    }
  });
  refs.lineSeries.isVisible = mode === "showLines" || mode === "showLinesAndPoints";
  refs.pointSeries.isVisible = mode === "showLinesAndPoints";
  refs.overviewColumnSeries.isVisible = mode === "showBins";
  refs.overviewLineSeries.isVisible = mode === "showLines" || mode === "showLinesAndPoints";
  refs.overviewPointSeries.isVisible = mode === "showLinesAndPoints";
  refs.overviewPointSeries.opacity = mode === "showLinesAndPoints" ? 1 : 0;
  refs.overviewLineSeries.opacity = mode === "showLines" || mode === "showLinesAndPoints" ? 1 : 0;
  refs.overviewColumnSeries.opacity = mode === "showBins" ? 1 : 0;
  refs.chartSurface.invalidateElement();
  refs.overview.overviewSciChartSurface.invalidateElement();
};
