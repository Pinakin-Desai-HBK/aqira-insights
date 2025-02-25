import { SciChartOverview, SciChartJsNavyTheme, NumberRange } from "scichart";
import { CreateChart } from "../../../types";
import { createSeries } from "./support/create/createSeries";
import { styleOverviewRangeSelection } from "src/components/dashboard-visualization/components/Shared/chart/prepare/utils/styleOverviewRangeSelection";
import { createModifiers } from "./support/create/createModifiers";
import { createXAxis } from "./support/create/createXAxis";
import { createYAxis } from "./support/create/createYAxis";
import { prepareYExtent } from "./support/utils/prepareYExtent";
import { syncOverviewWidth } from "src/components/dashboard-visualization/components/Shared/chart/prepare/utils/syncOverviewWidth";
import { updateChartModifiersForSurface } from "../../../context/hooks/useHistogramContext/support/updateChartModifiers";
import { createChartSurface } from "./support/create/createChartSurface";
import { processBinData } from "./support/utils/processBinData";
import { updateSeriesVisibility } from "../../utils/updateSeriesVisibility";
import {
  getConfigHelpers,
  setStoredChartState
} from "../../../context/hooks/useHistogramContext/support/storedChartState";

export const CustomTheme = {
  ...new SciChartJsNavyTheme(),
  sciChartBackground: "Transparent",
  loadingAnimationBackground: "Transparent",
  loadingAnimationForeground: "Transparent"
};

export const createChart: CreateChart = async ({
  minimapElement,
  chartData,
  name,
  sciChartResult,
  dashboardId,
  visualizationId,
  chartElement
}) => {
  if (!chartData.data) return;
  const chartElementDimensions = { width: chartElement.clientWidth, height: chartElement.clientHeight };
  const chartSurface = createChartSurface({ sciChartResult });
  if (!chartSurface) return;

  const wasmContext = sciChartResult.wasmContext;
  const { mode, tooltipsEnabled, showMinimap, scaleType, tickType, zoomRange } = getConfigHelpers({
    dashboardId,
    visualizationId
  }).getConfig();
  const {
    data: { bins, xDomain, binWidth, y }
  } = chartData;

  const { closestToZero, dataSeries } = processBinData({ bins, scaleType, wasmContext, yValues: y });
  const xAxis = createXAxis({
    wasmContext,
    xDomain,
    chartSurface,
    width: chartElementDimensions.width,
    tickType,
    xAxisLabel: chartData.xAxisLabel,
    bins
  });

  if (zoomRange && zoomRange.min >= xDomain.min && zoomRange.max <= xDomain.max) {
    xAxis.visibleRange = new NumberRange(zoomRange.min, zoomRange.max);
    setStoredChartState({
      newStoredChartState: { zoomRange: new NumberRange(zoomRange.min, zoomRange.max) },
      dashboardId,
      visualizationId
    });
  } else {
    xAxis.visibleRange = new NumberRange(xDomain.min, xDomain.max);
    setStoredChartState({ newStoredChartState: { zoomRange: null }, dashboardId, visualizationId });
  }

  const yAxis = createYAxis({
    wasmContext,
    chartSurface,
    height: chartElementDimensions.height,
    yAxisLabel: chartData.yAxisLabel,
    scaleType,
    yExtent: prepareYExtent({ chartData, usingBinsYRange: true, equaliseRanges: true }),
    closestToZero
  });

  const { columnSeries, lineSeries, pointSeries, tooltipSeries } = createSeries({
    wasmContext,
    binWidth,
    chartSurface,
    dataSeries,
    isOverview: false
  });

  createModifiers(
    chartSurface,
    scaleType,
    {
      columnSeries,
      lineSeries,
      pointSeries
    },
    tooltipSeries,
    closestToZero
  );

  const overview = await SciChartOverview.create(chartSurface, minimapElement, {
    canvasBorder: { border: 0 },
    padding: { left: 0, top: 0, right: 0, bottom: 0 },
    theme: CustomTheme,
    overviewYAxisOptions: {
      growBy: new NumberRange(0.1, 0.1),
      zoomExtentsToInitialRange: false
    },
    overviewXAxisOptions: {
      zoomExtentsToInitialRange: false,
      visibleRangeLimit: new NumberRange(xDomain.min, xDomain.max),
      zoomExtentsRange: new NumberRange(xDomain.min, xDomain.max)
    }
  });
  overview.overviewSciChartSurface.background = "#FFF";
  styleOverviewRangeSelection(overview, name);
  const {
    columnSeries: overviewColumnSeries,
    lineSeries: overviewLineSeries,
    pointSeries: overviewPointSeries
  } = createSeries({
    wasmContext,
    binWidth,
    chartSurface: overview.overviewSciChartSurface,
    dataSeries,
    isOverview: true
  });
  chartSurface.rendered.subscribe(() => syncOverviewWidth(chartSurface, minimapElement));
  chartData.refs = {
    chartSurface,
    columnSeries,
    lineSeries,
    pointSeries,
    xAxis,
    yAxis,
    wasmContext,
    overview,
    overviewColumnSeries,
    overviewLineSeries,
    overviewPointSeries
  };
  updateChartModifiersForSurface(chartSurface, mode, tooltipsEnabled);
  updateSeriesVisibility(chartData.refs, mode, binWidth);

  minimapElement.style.height = showMinimap ? "10%" : "0px";
  chartElement.style.height = showMinimap ? "90%" : "100%";
};
