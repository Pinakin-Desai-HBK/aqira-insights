import { RolloverModifier, SciChartSurface, XySeriesInfo } from "scichart";
import { ScaleType } from "src/insights/components/dashboard-visualization/components/Histogram/types";
import { filterReverse } from "../../../../../../Shared/chart/prepare/utils/logFilter";

export const updateRollOverModifier = (scaleType: ScaleType, closestToZero: number, chartSurface: SciChartSurface) => {
  const rolloverModifier = chartSurface.chartModifiers
    .asArray()
    .find((modifier) => modifier instanceof RolloverModifier);
  if (!rolloverModifier) return;
  rolloverModifier.tooltipDataTemplate = (seriesInfo: XySeriesInfo): string[] => {
    const xySeriesInfo = seriesInfo as XySeriesInfo;
    const valuesWithLabels: string[] = [];
    valuesWithLabels.push(`X: ${xySeriesInfo.formattedXValue}`);
    valuesWithLabels.push(
      `Y:  ${scaleType === "linear" ? xySeriesInfo.yValue : filterReverse({ y: xySeriesInfo.yValue, closestToZero })}`
    );
    return valuesWithLabels;
  };
};
