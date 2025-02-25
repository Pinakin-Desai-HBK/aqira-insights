import { NumericAxis, SciChartSurface, TSciChart } from "scichart";
import { axisOptions } from "src/components/dashboard-visualization/components/Shared/chart/prepare/utils/axisOptions";
import { formatLabel } from "src/components/dashboard-visualization/components/Shared/chart/prepare/utils/formatLabel";
import { Range } from "src/redux/types/ui/dashboardVisualization";
import { Bin, TickType } from "../../../../../types";
import { updateXAxis } from "../update/updateXAxis";

export const createXAxis = ({
  wasmContext,
  xDomain,
  chartSurface,
  xAxisLabel,
  bins,
  width,
  tickType
}: {
  wasmContext: TSciChart;
  xDomain: Range;
  chartSurface: SciChartSurface;
  xAxisLabel: string;
  bins: Bin[];
  width: number;
  tickType: TickType;
}) => {
  const xAxis = new NumericAxis(wasmContext, {
    ...axisOptions,
    rotation: 270,
    drawMinorTickLines: true,
    drawMajorTickLines: true,
    zoomExtentsToInitialRange: false,
    minorTickLineStyle: {
      color: "#AAA",
      strokeThickness: 1,
      tickSize: 5
    }
  });
  xAxis.labelProvider.formatLabel = (dataLabel: number) => {
    return formatLabel(dataLabel, xAxis.visibleRange, width);
  };
  xAxis.labelProvider.formatCursorLabel = (dataLabel: number) => {
    return formatLabel(dataLabel, xAxis.visibleRange, width);
  };
  chartSurface.xAxes.add(xAxis);
  updateXAxis({ wasmContext, xAxis, xDomain, bins, width, tickType, xAxisLabel });
  return xAxis;
};
