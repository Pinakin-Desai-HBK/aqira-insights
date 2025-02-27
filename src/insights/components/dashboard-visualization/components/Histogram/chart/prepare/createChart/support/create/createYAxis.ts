import { EAxisAlignment, NumberRange, NumericAxis, SciChartSurface, TSciChart } from "scichart";
import { axisOptions } from "src/insights/components/dashboard-visualization/components/Shared/chart/prepare/utils/axisOptions";
import { ScaleType } from "../../../../../types";
import { updateYAxis } from "../update/updateYAxis";

export const createYAxis = ({
  wasmContext,
  chartSurface,
  yAxisLabel,
  scaleType,
  yExtent,
  closestToZero,
  height
}: {
  wasmContext: TSciChart;
  chartSurface: SciChartSurface;
  yAxisLabel: string;
  scaleType: ScaleType;
  yExtent: NumberRange;
  closestToZero: number;
  height: number;
}) => {
  const yAxis = new NumericAxis(wasmContext, {
    ...axisOptions,
    axisAlignment: EAxisAlignment.Left,
    zoomExtentsToInitialRange: false,
    minorsPerMajor: 3,
    minorTickLineStyle: {
      color: "#AAA",
      strokeThickness: 1,
      tickSize: 5
    }
  });
  chartSurface.yAxes.add(yAxis);
  updateYAxis({ yAxis, yExtent, closestToZero, height, wasmContext, scaleType, yAxisLabel });
  return yAxis;
};
