import { createSciChartSurfaceForElem } from "src/insights/components/dashboard-visualization/components/useSciChartSurface";
import { createChart } from "../../../chart/prepare/createChart/createChart";
import { updateChart } from "../../../chart/prepare/createChart/updateChart";
import { ChartData, ChartRefs } from "../../../types";

export const processChartData = async ({
  chartData,
  dashboardId,
  name,
  visualizationId,
  chartElement,
  minimapElement
}: {
  dashboardId: string;
  name: string;
  visualizationId: string;
  chartData: ChartData;
  minimapElement: HTMLDivElement | null;
  chartElement: HTMLDivElement | null;
}) => {
  const createChartHandler = async () => {
    if (chartData.dataSetId === null || chartData.data === null) {
      return "Invalid state - CREATE CHART HANDLER";
    }
    if (chartData === null || minimapElement === null || chartElement === null) return null;
    const sciChartResult = await createSciChartSurfaceForElem(chartElement);
    if (!sciChartResult) {
      return "No SciChart surface";
    }
    await createChart({
      chartElement,
      minimapElement,
      chartData,
      name,
      sciChartResult,
      dashboardId,
      visualizationId
    });

    setTimeout(() => {
      if (chartData.refs) {
        chartData.refs.chartSurface.invalidateElement();
      }
    }, 0);

    return chartData;
  };
  const updateChartHandler = async (refs: ChartRefs) => {
    if (chartElement === null || minimapElement === null || chartData.dataSetId === null || chartData.data === null)
      return "Invalid state - UPDATE CHART HANDLER";
    refs.chartSurface.suspendUpdates();
    refs.overview.overviewSciChartSurface.suspendUpdates();
    await updateChart({
      chartElement,
      chartData,
      chartSurface: refs.chartSurface,
      overview: refs.overview,
      dashboardId,
      visualizationId,
      minimapElement
    });

    refs.chartSurface.invalidateElement();
    refs.chartSurface.resume();
    refs.overview.overviewSciChartSurface.resume();
    return chartData;
  };
  if (chartData.refs?.chartSurface) {
    return await updateChartHandler(chartData.refs);
  } else {
    return await createChartHandler();
  }
};
