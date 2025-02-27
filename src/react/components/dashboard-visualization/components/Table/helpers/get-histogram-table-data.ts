import { getData } from "src/react/api/Data";
import { HistogramTableAxis, TableColumnData } from "src/react/redux/types/ui/table";
import { getColumnData } from "../utils/getColumnData";
import { base64ToDouble } from "../../Shared/hooks/utils/base64ToDoubleArray";
import { VisDataSetDataType } from "src/react/redux/types/ui/dashboardVisualization";
import styles from "../Table.module.css";

export const getHistogramTableData = async (
  dataSetId: string,
  channelName: string,
  index: number,
  axis: HistogramTableAxis
): Promise<{ tableColumns: TableColumnData[]; tableRows: Record<string, unknown>[] }> => {
  const chartData = await getData({
    payload: {
      $queryType: "absoluteHistogram",
      channelNames: [channelName],
      index,
      typeFilter: ["h2axis", "h3axis"]
    },
    visType: axis === "h2axis" ? "Histogram" : "Histogram3D",
    dataSetId
  });

  const getTableColumns = (): TableColumnData[] => {
    const tableColumns: TableColumnData[] = [];
    if (axis === "h3axis") {
      tableColumns.push({
        ...getColumnData("yValues", "", ""),
        headerClassName: styles.histogramTable3DColumnHeader!,
        cellClassName: styles.histogramTable3DCell!
      });
    }
    tableColumns.push(
      ...chartData.histograms[0]!.data.x.map((column) =>
        getColumnData(base64ToDouble(column.midPoint)!.toString(), base64ToDouble(column.midPoint)!.toString(), "")
      )
    );
    return tableColumns;
  };

  const get2DTableRows = (): Record<string, unknown>[] => {
    const rowColumnData: Record<string, unknown> = { id: 0 };
    (chartData as VisDataSetDataType<"Histogram">).histograms[0]!.data.y.map(
      (column, i) =>
        (rowColumnData[base64ToDouble(chartData.histograms[0]!.data.x[i]!.midPoint)!.toString()] = base64ToDouble(
          column.value
        )!.toString())
    );
    return [rowColumnData];
  };

  const get3DTableRows = (): Record<string, unknown>[] => {
    let cells: Record<string, unknown>[] = [];
    const numColumns = chartData.histograms[0]!.data.x.length;
    const numRows = chartData.histograms[0]!.data.y.length;

    for (let i = 0; i < numRows; i++) {
      const rowColumnData: Record<string, unknown> = { id: 0 };
      // The first column is the yValues
      for (let j = 0; j < numColumns + 1; j++) {
        if (j === 0) {
          // This index calculation is required for "yValues" and because the data is transposed
          const index = numRows - 1 - i;
          const value = (chartData as VisDataSetDataType<"Histogram3D">).histograms[0]!.data.y[index]!.midPoint;
          rowColumnData["yValues"] = base64ToDouble(value)!.toFixed(3).toString();
          rowColumnData["id"] = value;
        } else {
          // This index calculation is required to ignore "yValues" and because the data is transposed
          const index = numRows - 1 - i + (j - 1) * numRows;
          rowColumnData[base64ToDouble(chartData.histograms[0]!.data.x[j - 1]!.midPoint)!.toString()] = base64ToDouble(
            (chartData as VisDataSetDataType<"Histogram3D">).histograms[0]!.data.z[index]!.value
          )!.toString();
          rowColumnData["id"] = index;
        }
      }
      cells.push(rowColumnData);
    }

    return cells;
  };

  const getTableRows = (): Record<string, unknown>[] => {
    if (axis === "h2axis") {
      return get2DTableRows();
    } else {
      return get3DTableRows();
    }
  };

  const tableColumns = getTableColumns();
  const tableRows = getTableRows();

  return { tableColumns, tableRows };
};
