import { NumberRange } from "scichart";
import { setStoredChartState } from "src/insights/components/dashboard-visualization/components/Histogram/context/hooks/useHistogramContext/support/storedChartState";
import { ChartRefs } from "src/insights/components/dashboard-visualization/components/Histogram/types";

export const updateZoom = ({
  refs,
  zoomRange,
  fullRange,
  dashboardId,
  visualizationId
}: {
  zoomRange: NumberRange | null;
  refs: ChartRefs | null;
  fullRange: NumberRange;
  dashboardId: string;
  visualizationId: string;
}) => {
  if (!refs) return;
  const zoomExtentsRange = refs.overview.overviewSciChartSurface.xAxes.get(0).zoomExtentsRange;
  const hasFullRangeChanged = zoomExtentsRange.min !== fullRange.min || zoomExtentsRange.max !== fullRange.max;
  refs.overview.overviewSciChartSurface.xAxes.get(0).visibleRangeLimit = new NumberRange(fullRange.min, fullRange.max);
  refs.overview.overviewSciChartSurface.xAxes.get(0).zoomExtentsRange = new NumberRange(fullRange.min, fullRange.max);
  const checkMin = zoomRange && zoomRange.min >= fullRange.min && zoomRange.min < fullRange.max;
  const checkMax = zoomRange && zoomRange.max >= fullRange.min && zoomRange.max <= fullRange.max;
  const newRange =
    (checkMin || checkMax) && !hasFullRangeChanged
      ? new NumberRange(checkMin ? zoomRange.min : fullRange.min, checkMax ? zoomRange.max : fullRange.max)
      : null;
  refs.chartSurface.xAxes.get(0).visibleRange = newRange ?? fullRange;
  setStoredChartState({
    newStoredChartState: { zoomRange: newRange },
    dashboardId,
    visualizationId
  });
};
