import { SciChartOverview, NumericAxis, SciChartSurface, NumberRange } from "scichart";
import { ChartData } from "../../../types";
import { prepareYExtent } from "./support/utils/prepareYExtent";
import { updateChartModifiersForSurface } from "../../../context/hooks/useHistogramContext/support/updateChartModifiers";
import { updateXAxis } from "./support/update/updateXAxis";
import { updateYAxis } from "./support/update/updateYAxis";
import { updateRollOverModifier } from "./support/update/updateRollOverModifier";
import { updateSeries } from "./support/update/updateSeries";
import { processBinData } from "./support/utils/processBinData";
import { updateZoom } from "./support/update/updateZoom";
import { updateSeriesVisibility } from "../../utils/updateSeriesVisibility";
import { getConfigHelpers } from "../../../context/hooks/useHistogramContext/support/storedChartState";

export const updateChart = async ({
  chartData,
  overview,
  chartSurface,
  dashboardId,
  visualizationId,
  chartElement,
  minimapElement
}: {
  chartData: ChartData;
  overview: SciChartOverview;
  chartSurface: SciChartSurface;
  dashboardId: string;
  visualizationId: string;
  chartElement: HTMLElement;
  minimapElement: HTMLDivElement;
}) => {
  if (!chartData.data) return;
  const chartElementDimensions = { width: chartElement.clientWidth, height: chartElement.clientHeight };
  const {
    refs,
    data: { bins, xDomain, binWidth, y }
  } = chartData;
  if (!refs || !refs.wasmContext) return;
  const { wasmContext } = refs;
  const { mode, tooltipsEnabled, showMinimap, scaleType, tickType, zoomRange } = getConfigHelpers({
    dashboardId,
    visualizationId
  }).getConfig();
  const { closestToZero, dataSeries } = processBinData({ bins, scaleType, wasmContext, yValues: y });
  const xAxis = chartSurface.xAxes.get(0);
  if (xAxis && xAxis instanceof NumericAxis)
    updateXAxis({
      bins,
      xAxis,
      wasmContext,
      xDomain,
      width: chartElementDimensions.width,
      xAxisLabel: chartData.xAxisLabel,
      tickType
    });
  const yAxis = chartSurface.yAxes.get(0);
  if (yAxis && yAxis instanceof NumericAxis)
    updateYAxis({
      yAxis,
      height: chartElementDimensions.height,
      closestToZero,
      scaleType,
      wasmContext,
      yAxisLabel: chartData.yAxisLabel,
      yExtent: prepareYExtent({ chartData, usingBinsYRange: true, equaliseRanges: true })
    });
  updateRollOverModifier(scaleType, closestToZero, chartSurface);
  updateSeries({
    binWidth,
    dataSeries,
    series: chartSurface.renderableSeries.asArray()
  });
  updateSeries({
    binWidth,
    dataSeries,
    series: overview.overviewSciChartSurface.renderableSeries.asArray()
  });
  updateChartModifiersForSurface(chartSurface, mode, tooltipsEnabled);
  updateZoom({ refs, zoomRange, fullRange: new NumberRange(xDomain.min, xDomain.max), dashboardId, visualizationId });
  updateSeriesVisibility(refs, mode, binWidth);
  minimapElement.style.height = showMinimap ? "10%" : "0px";
  chartElement.style.height = showMinimap ? "90%" : "100%";
};
