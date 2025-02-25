import { SciChartOverview, SciChartSurface } from "scichart";

export const isZoomed = (chart: SciChartSurface | null, miniMapChart: SciChartOverview | null) => {
  if (!chart || !miniMapChart) return false;
  const scalesX = chart.xAxes.get(0).visibleRange;
  const xLimits = miniMapChart.overviewSciChartSurface.xAxes.get(0).visibleRange;
  return !!scalesX && !!xLimits && (scalesX.min > xLimits.min || scalesX.max < xLimits.max);
};
