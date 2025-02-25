import { ChartData, ChartRefs } from "../../../types";
import { processChartSurface3DData } from "../../../chart/processChartSurface3DData";
import { createChart } from "../../../chart/createChart";
import { updateChart } from "../../../chart/updateChart";
import { createSciChartSurface3DForElem } from "src/components/dashboard-visualization/components/useSciChartSurface";

export const processChartData = async ({
  chartData,
  dashboardId,
  name,
  visualizationId,
  chartElement
}: {
  dashboardId: string;
  name: string;
  visualizationId: string;
  chartData: ChartData;
  chartElement: HTMLDivElement | null;
}) => {
  const binData = chartData.data;
  if (!binData || !chartElement || !chartData.dataSetId) return "Invalid state - PROCESS CHART DATA";
  const createChartHandler = async () => {
    const sciChartResult = await createSciChartSurface3DForElem(chartElement);
    if (!sciChartResult) {
      return "Invalid state - CREATE CHART HANDLER";
    }
    const processedChartData = processChartSurface3DData({
      binData,
      wasmContext: sciChartResult.wasmContext,
      colors: chartData.colors
    });
    await createChart({
      chartElement,
      chartData,
      name,
      sciChartResult,
      dashboardId,
      visualizationId,
      processedChartData
    });
    if (!chartData.refs) {
      return "Invalid state - CREATE CHART HANDLER";
    }
    await updateChart({
      chartData,
      processedChartData
    });
    setTimeout(() => {
      if (chartData.refs) {
        chartData.refs.chartSurface.invalidateElement();
      }
    }, 0);

    return chartData;
  };
  const updateChartHandler = async (refs: ChartRefs) => {
    refs.chartSurface.suspendUpdates();
    const processedChartData = processChartSurface3DData({
      binData,
      wasmContext: refs.wasmContext,
      colors: chartData.colors
    });
    await updateChart({
      chartData,
      processedChartData
    });

    refs.chartSurface.invalidateElement();
    refs.chartSurface.resume();

    return chartData;
  };
  if (chartData.refs?.chartSurface) {
    return await updateChartHandler(chartData.refs);
  } else {
    return await createChartHandler();
  }
};
