import { NumberRange, NumericAxis, TSciChart } from "scichart";
import { Range } from "src/redux/types/ui/dashboardVisualization";
import { CustomXTickProvider } from "../customProviders/CustomXTickProvider";
import { Bin, TickType } from "../../../../../types";

export const updateXAxis = ({
  wasmContext,
  xAxis,
  xDomain,
  bins,
  width,
  tickType,
  xAxisLabel
}: {
  wasmContext: TSciChart;
  xAxis: NumericAxis;
  xDomain: Range;
  bins: Bin[];
  width: number;
  tickType: TickType;
  xAxisLabel: string;
}) => {
  const xRange = new NumberRange(xDomain.min, xDomain.max);
  xAxis.visibleRangeLimit = xRange;
  xAxis.zoomExtentsRange = xRange;
  xAxis.visibleRangeSizeLimit = new NumberRange(
    (xDomain.max - xDomain.min) / (bins.length / 2),
    xDomain.max - xDomain.min
  );
  xAxis.tickProvider = new CustomXTickProvider(wasmContext, bins, tickType, width);
  xAxis.axisTitle = xAxisLabel;
};
