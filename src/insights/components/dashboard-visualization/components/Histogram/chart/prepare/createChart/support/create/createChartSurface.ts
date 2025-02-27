import { SciChartJSDarkv2Theme } from "scichart";
import { CreateChartSurface } from "src/insights/components/dashboard-visualization/components/Histogram/types";

export const createChartSurface: CreateChartSurface = ({ sciChartResult }) => {
  const chartSurface = sciChartResult.sciChartSurface;
  chartSurface.applyTheme(new SciChartJSDarkv2Theme());
  chartSurface.background = "#FFF";
  chartSurface.viewportBorder = { border: 0 };
  chartSurface.canvasBorder = { border: 0 };
  chartSurface.padding = { left: 0, top: 0, right: 0, bottom: 0 };
  return chartSurface;
};
