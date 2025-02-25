import { NumberRange } from "scichart";
import { LineChartDataWithColor } from "../../types";

export const getYRangeFromData = (minimapChartColumns: LineChartDataWithColor[]) => {
  const yRangeBase = minimapChartColumns.reduce(
    (acc, column) => {
      const min = Math.min(...column.data.y);
      const max = Math.max(...column.data.y);
      return new NumberRange(
        Math.min(acc !== null ? acc.min : Infinity, min),
        Math.max(acc !== null ? acc.max : -Infinity, max)
      );
    },
    null as NumberRange | null
  );
  if (!yRangeBase) return null;
  const yRange = new NumberRange(
    yRangeBase.min - (yRangeBase.max - yRangeBase.min) * 0.1,
    yRangeBase.max + (yRangeBase.max - yRangeBase.min) * 0.1
  );
  return yRange;
};
