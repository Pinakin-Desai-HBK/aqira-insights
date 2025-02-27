import {
  CursorModifier,
  EExecuteOn,
  EXyDirection,
  FastLineRenderableSeries,
  MouseWheelZoomModifier,
  RolloverModifier,
  RubberBandXyZoomModifier,
  SciChartSurface,
  ZoomExtentsModifier
} from "scichart";
import { ChartSeries, ScaleType } from "../../../../../types";
import { DisableTooltipZoomPanModifier } from "src/react/components/dashboard-visualization/components/Shared/chart/prepare/customModifiers/DisableTooltipZoomPanModifier";
import { updateRollOverModifier } from "../update/updateRollOverModifier";

export const createModifiers = (
  chartSurface: SciChartSurface,
  scaleType: ScaleType,
  series: ChartSeries,
  tooltipSeries: FastLineRenderableSeries,
  closestToZero: number
) => {
  const { columnSeries, lineSeries, pointSeries } = series;
  const cursorModifier = new CursorModifier({
    showTooltip: false,
    showYLine: true,
    showXLine: true
  });
  chartSurface.chartModifiers.add(new ZoomExtentsModifier({}));
  chartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
  chartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
  chartSurface.chartModifiers.add(
    new RubberBandXyZoomModifier({
      xyDirection: EXyDirection.XDirection,
      executeOn: EExecuteOn.MouseLeftButton
    })
  );
  const rollOverModifier = new RolloverModifier({
    xyDirection: EXyDirection.XyDirection,
    showTooltip: true,
    snapToDataPoint: true,
    showRolloverLine: false
  });
  rollOverModifier.includeSeries(columnSeries, false);
  rollOverModifier.includeSeries(lineSeries, false);
  rollOverModifier.includeSeries(pointSeries, false);
  rollOverModifier.includeSeries(tooltipSeries, true);
  chartSurface.chartModifiers.add(rollOverModifier);
  chartSurface.chartModifiers.add(
    new DisableTooltipZoomPanModifier([rollOverModifier, cursorModifier], {
      xyDirection: EXyDirection.XDirection,
      executeOn: EExecuteOn.MouseRightButton
    })
  );
  chartSurface.chartModifiers.add(cursorModifier);
  updateRollOverModifier(scaleType, closestToZero, chartSurface);
};
