import { NumberRange, NumericAxis, VisibleRangeChangedArgs } from "scichart";
import { ChartData, RefreshColmnsHandler } from "../../../types";
import { debounceTime, Subject } from "rxjs";
import { transferColumnDataToSeries } from "../../utils/transferColumnDataToSeries";
import { updateYRange } from "../../utils/updateYRange";

export const handleVisibleRangeChange = ({
  chartData,
  updateColumnData,
  xAxis
}: {
  chartData: ChartData;
  updateColumnData: RefreshColmnsHandler;
  xAxis: NumericAxis;
}) => {
  const subject = new Subject<NumberRange>();
  const { dataSetId, datasetLabels } = chartData;

  xAxis.visibleRangeChanged.subscribe(async (args: VisibleRangeChangedArgs | undefined) => {
    if (!args) return;
    const { visibleRange } = args;
    subject.next(visibleRange);
  });

  subject.pipe(debounceTime(10)).subscribe(async (r: NumberRange) => {
    if (!dataSetId || !datasetLabels) return;

    await updateColumnData({
      range: r,
      dataSetId,
      datasetLabels: chartData.datasetLabels
    }).then((result) => {
      if (!result) return;
      if (!chartData.chartSurface) throw new Error("Chart not found");
      const { chartColumnsWithUpdatedLabels } = result;
      chartData.chartColumns = chartColumnsWithUpdatedLabels;
      chartData.chartSurface.suspendUpdates();

      transferColumnDataToSeries(chartData.chartColumns, chartData.xySeriesArray);
      updateYRange(chartData.chartSurface);
      chartData.chartSurface.resume();
    });
  });
};
