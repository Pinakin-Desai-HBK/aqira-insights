import { SciChartOverview } from "scichart";

const setMouseCursor = (e: MouseEvent, overview: SciChartOverview) => {
  const selectedRange = overview.rangeSelectionModifier.selectedArea;
  const fullRange = overview.overviewXAxis.visibleRange;
  const canvas2D = overview.overviewSciChartSurface.domCanvas2D;
  const overviewWidth = canvas2D.clientWidth - overview.overviewSciChartSurface.padding.left;
  const fullRangeExtent = fullRange.max - fullRange.min;
  const rangeMinToPixel = (selectedRange?.min - fullRange.min) * (overviewWidth / fullRangeExtent);
  const rangeMaxToPixel = (selectedRange?.max - fullRange.min) * (overviewWidth / fullRangeExtent);
  const posX = e.offsetX - overview.overviewSciChartSurface.padding.left;
  const isMouseOverLeftBoundary = posX > rangeMinToPixel - 6 && posX < rangeMinToPixel + 6;
  const isMouseOverRightBoundary = posX > rangeMaxToPixel - 6 && posX < rangeMaxToPixel + 6;
  const isMouseOverRange = posX > rangeMinToPixel + 6 && posX < rangeMaxToPixel - 6;

  if (isMouseOverRange) {
    canvas2D.style.cursor = "grab";
  } else if (isMouseOverLeftBoundary || isMouseOverRightBoundary) {
    canvas2D.style.cursor = "ew-resize";
  } else {
    canvas2D.style.cursor = "pointer";
  }
};

export const createCursorListener = (overview: SciChartOverview) => {
  const listeners = {
    mousemove: (e: MouseEvent) => {
      setMouseCursor(e, overview);
    },
    mouseover: (e: MouseEvent) => {
      setMouseCursor(e, overview);
    }
  };
  overview.overviewSciChartSurface.domCanvas2D.addEventListener("mousemove", listeners.mousemove);
  overview.overviewSciChartSurface.domCanvas2D.addEventListener("mouseover", listeners.mouseover);
  return () => {
    overview.overviewSciChartSurface.domCanvas2D.removeEventListener("mousemove", listeners.mousemove);
    overview.overviewSciChartSurface.domCanvas2D.removeEventListener("mouseover", listeners.mouseover);
  };
};
