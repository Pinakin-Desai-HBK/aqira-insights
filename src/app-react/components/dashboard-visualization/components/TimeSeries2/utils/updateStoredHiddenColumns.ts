import { HiddenColumnsKey, HiddenColumnsMap, UpdateStoredHiddenColumns } from "../types";

export const updateStoredHiddenColumns: UpdateStoredHiddenColumns = ({ chart, dataSetId, setStoredChartState }) => {
  if (!chart) return;
  const hiddenColumns: HiddenColumnsMap = chart.renderableSeries.asArray().reduce((result, column) => {
    const key: HiddenColumnsKey = `${dataSetId}-${column.getDataSeriesName()}`;
    return {
      ...result,
      [key]: !column.isVisible
    };
  }, {} as HiddenColumnsMap);
  setStoredChartState({
    newStoredChartState: {
      hiddenColumns
    }
  });
};
