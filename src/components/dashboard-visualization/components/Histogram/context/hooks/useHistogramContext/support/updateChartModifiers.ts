import { CursorModifier, RolloverModifier, SciChartSurface } from "scichart";
import { ChartData, HistogramMode } from "../../../../types";

export const updateChartModifiers = (chartData: ChartData, mode: HistogramMode, tooltipsEnabled: boolean) => {
  if (!chartData.refs) return;
  const { chartSurface } = chartData.refs;
  updateChartModifiersForSurface(chartSurface, mode, tooltipsEnabled);
};

export const updateChartModifiersForSurface = (
  chartSurface: SciChartSurface,
  mode: HistogramMode,
  tooltipsEnabled: boolean
) => {
  chartSurface.chartModifiers.asArray().forEach((chartModifier) => {
    if (chartModifier instanceof CursorModifier) {
      chartModifier.isEnabled = mode !== "showBins";
    }
    if (chartModifier instanceof RolloverModifier) {
      chartModifier.isEnabled = tooltipsEnabled;
    }
  });
};
