import { ColumnRenderableSeries3D, CubePointMarker3D, NumberRange, Vector3 } from "scichart";
import { ChartData } from "../types";
import { ProcessedChartSurface3DData } from "./processChartSurface3DData";

export const updateChart = async ({
  chartData,
  processedChartData
}: {
  chartData: ChartData;
  processedChartData: ProcessedChartSurface3DData;
}) => {
  if (!chartData.refs) return;
  const { chartSurface, wasmContext } = chartData.refs;
  const { dataSeries, ranges } = processedChartData;

  chartSurface.renderableSeries.clear();
  const binWidth = chartData.data?.binWidth || 1;
  const binDepth = chartData.data?.binDepth || 1;
  const series = new ColumnRenderableSeries3D(wasmContext, {
    dataSeries,
    fill: "#686de0",
    stroke: "#280d60",
    pointMarker: new CubePointMarker3D(wasmContext, { fill: "#280d60", size: binWidth }),
    dataPointWidthX: binWidth,
    dataPointWidthZ: binDepth,
    opacity: 1,
    useMetadataColors: true
  });
  chartSurface.renderableSeries.add(series);

  chartData.refs = { ...chartData.refs };

  chartSurface.yAxis.visibleRange = new NumberRange(ranges.y.min, ranges.y.max);
  chartSurface.xAxis.visibleRange = new NumberRange(ranges.x.min, ranges.x.max);
  chartSurface.zAxis.visibleRange = new NumberRange(ranges.z.min, ranges.z.max);

  const xRange = ranges.x.max - ranges.x.min;
  const zRange = ranges.z.max - ranges.z.min;

  chartSurface.worldDimensions = new Vector3((300 / binWidth) * binDepth, 200, (300 / xRange) * zRange);

  chartSurface.xAxis.axisTitle = chartData.xAxisLabel;
  chartSurface.yAxis.axisTitle = chartData.zAxisLabel;
  chartSurface.zAxis.axisTitle = chartData.yAxisLabel;

  chartSurface.xAxis.validateAxis();
  chartSurface.yAxis.validateAxis();
  chartSurface.zAxis.validateAxis();
  chartSurface.axisCubeEntity.invalidateScene();
};
