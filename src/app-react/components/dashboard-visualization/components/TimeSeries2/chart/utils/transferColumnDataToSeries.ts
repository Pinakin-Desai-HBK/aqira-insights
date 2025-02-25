import { XyDataSeries } from "scichart";
import { LineChartDataWithColor } from "../../types";

export const transferColumnDataToSeries = (columns: LineChartDataWithColor[], xySeriesArray: XyDataSeries[]) => {
  columns.forEach((column, index) => {
    const series = xySeriesArray[index];
    if (!series) return;
    series.clear();
    series.appendRange(column.data.x, column.data.y);
  });
};
