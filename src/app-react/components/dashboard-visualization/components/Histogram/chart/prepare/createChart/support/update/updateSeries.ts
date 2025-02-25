import { FastColumnRenderableSeries, IRenderableSeries, XyCustomFilter, XyDataSeries } from "scichart";

export const updateSeries = ({
  binWidth,
  dataSeries,
  series
}: {
  binWidth: number;
  dataSeries: XyCustomFilter | XyDataSeries;
  series: IRenderableSeries[];
}) =>
  series.forEach((s) => {
    s.dataSeries = dataSeries;
    if (s instanceof FastColumnRenderableSeries) s.dataPointWidth = binWidth;
  });
