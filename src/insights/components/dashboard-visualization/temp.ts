import { DashboardVisualizationDataUI } from "src/insights/redux/types/ui/dashboardVisualization";

export const showHistogram2D = (tempInput: DashboardVisualizationDataUI) => {
  return tempInput.type === "TimeSeries" && tempInput.name.startsWith("HISTOGRAM2D");
};

export const showHistogram3D = (tempInput: DashboardVisualizationDataUI) => {
  return tempInput.type === "TimeSeries" && tempInput.name.startsWith("HISTOGRAM3D");
};
