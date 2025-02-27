import { SciChartSurface } from "scichart";

export const syncOverviewWidth = (main: SciChartSurface, overviewDiv: HTMLDivElement) => {
  if (!main.domBackgroundSvgContainer) return;
  overviewDiv.style.width = main.domBackgroundSvgContainer.style.width;
};
