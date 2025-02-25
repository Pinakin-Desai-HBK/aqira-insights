import {
  EDataPointWidthMode,
  EPointMarkerType,
  FastColumnRenderableSeries,
  FastLineRenderableSeries,
  SciChartSurface,
  TSciChart,
  XyCustomFilter,
  XyDataSeries
} from "scichart";
import { ChartSeries } from "../../../../../types";
import { updateSeries } from "../update/updateSeries";

export const createSeries = ({
  wasmContext,
  binWidth,
  chartSurface,
  dataSeries,
  isOverview
}: {
  wasmContext: TSciChart | null;
  binWidth: number;
  chartSurface: SciChartSurface | null;
  dataSeries: XyCustomFilter | XyDataSeries;
  isOverview: boolean;
}): ChartSeries & { tooltipSeries: FastLineRenderableSeries } => {
  if (!wasmContext || !chartSurface) throw new Error("Missing chart surface or wasm context");
  const columnSeries = new FastColumnRenderableSeries(wasmContext, {
    dataLabels: {
      pointGapThreshold: 0,
      pointCountThreshold: 1
    },
    dataPointWidthMode: EDataPointWidthMode.Range,
    fill: "#8387eb",
    stroke: "#686de0",
    strokeThickness: 1,
    dataPointWidth: binWidth,
    cornerRadius: 0,
    isVisible: false
  });
  chartSurface.renderableSeries.add(columnSeries);
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#222",
    strokeThickness: isOverview ? 1 : 2,
    isVisible: false
  });
  chartSurface.renderableSeries.add(lineSeries);
  const pointSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#222",
    strokeThickness: 0,
    isVisible: false,
    pointMarker: {
      options: {
        height: isOverview ? 5 : 10,
        width: isOverview ? 5 : 10,
        fill: "#FFF",
        stroke: "#222",
        strokeThickness: isOverview ? 1 : 2
      },
      type: EPointMarkerType.Ellipse
    }
  });
  chartSurface.renderableSeries.add(pointSeries);
  const tooltipSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries,
    stroke: "#222",
    strokeThickness: 4,
    isVisible: true,
    opacity: 0
  });
  chartSurface.renderableSeries.add(tooltipSeries);
  updateSeries({ binWidth, dataSeries, series: chartSurface.renderableSeries.asArray() });
  return {
    columnSeries,
    lineSeries,
    pointSeries,
    tooltipSeries
  };
};
