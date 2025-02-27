import { NumberRange, NumericAxis, NumericTickProvider, TSciChart } from "scichart";
import { ScaleType } from "../../../../../types";
import { filter, filterReverse } from "../../../../../../Shared/chart/prepare/utils/logFilter";
import {
  formatLabel,
  formatLabelUsingList
} from "src/react/components/dashboard-visualization/components/Shared/chart/prepare/utils/formatLabel";
import { CustomYTickProvider } from "../customProviders/CustomYTickProvider";

export const updateYAxis = ({
  yAxis,
  yExtent,
  closestToZero,
  height,
  wasmContext,
  scaleType,
  yAxisLabel
}: {
  yAxis: NumericAxis;
  yExtent: NumberRange;
  closestToZero: number;
  height: number;
  wasmContext: TSciChart;
  scaleType: ScaleType;
  yAxisLabel: string;
}) => {
  const tickProvider = scaleType === "logarithmic" ? new CustomYTickProvider(wasmContext, closestToZero) : undefined;
  const padding = Math.abs(yExtent.max - yExtent.min) * 0.1;
  const yRange = new NumberRange(
    yExtent.min < 0
      ? scaleType === "logarithmic"
        ? filter({ y: yExtent.min - padding, closestToZero })
        : yExtent.min - padding
      : 0,
    yExtent.max > 0
      ? scaleType === "logarithmic"
        ? filter({ y: yExtent.max + padding, closestToZero })
        : yExtent.max + padding
      : 0
  );
  yAxis.visibleRange = yRange;
  yAxis.visibleRangeLimit = yRange;
  yAxis.zoomExtentsRange = yRange;
  yAxis.axisTitle = yAxisLabel;
  if (tickProvider) {
    yAxis.tickProvider = tickProvider;
    yAxis.autoTicks = false;
  } else {
    yAxis.maxAutoTicks = 20;
    yAxis.autoTicks = true;
    yAxis.tickProvider = new NumericTickProvider(wasmContext);
  }
  yAxis.labelProvider.formatLabel = (y: number) =>
    tickProvider
      ? formatLabelUsingList(
          filterReverse({ y, closestToZero }),
          yExtent,
          tickProvider.getMajorTicksUnfiltered(0, 0, yAxis.visibleRange)
        )
      : formatLabel(y, yAxis.visibleRange, height);
};
