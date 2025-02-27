import { TableColumnData, TablePaginationData } from "src/insights/redux/types/ui/table";
import { getColumnData } from "../utils/getColumnData";
import { TableKey } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { StatelessVisDataSetType } from "src/insights/redux/types/ui/dashboardVisualization";
import Papa from "papaparse";
import { getData } from "src/insights/api/Data";

export const getNumberTableData = async (
  schema: StatelessVisDataSetType<TableKey>,
  dataSetId: string,
  rowsPerPage: number,
  pageNumber: number,
  currentTablePaginationData: TablePaginationData,
  dataRangeLength: number
): Promise<{
  tableColumns: TableColumnData[];
  tableRows: Record<string, unknown>[];
  newTablePaginationData: TablePaginationData;
}> => {
  const tableColumns: TableColumnData[] = [
    getColumnData("id", schema.index.name, schema.index.units),
    ...schema.dataColumns.map((column) => getColumnData(column.name, column.name, column.units))
  ];

  const dataResult = await getData({
    dataSetId: dataSetId,
    visType: "Table",
    payload: {
      $queryType: "paged",
      pageNumber,
      pageSize: rowsPerPage
    }
  });

  if (dataResult === null) {
    throw new Error(`Data is null`);
  }

  const rows: string[][] = Papa.parse(dataResult.data).data as string[][];
  rows.pop();

  const tableRows: Record<string, unknown>[] = rows.map((row, index) => {
    const rowColumnData: Record<string, unknown> = { id: index };
    tableColumns.map((column, i) => (rowColumnData[column.field] = row[i]));
    return rowColumnData;
  });

  const firstItemIndex = (pageNumber - 1) * rowsPerPage + 1;
  const lastItemIndex = rowsPerPage >= dataRangeLength ? dataRangeLength : firstItemIndex + rows.length - 1;

  const newTablePaginationData: TablePaginationData = {
    ...currentTablePaginationData,
    firstItemIndex,
    lastItemIndex,
    nextisEnabled: dataRangeLength > lastItemIndex,
    prevIsEnabled: pageNumber > 1,
    totalNumberOfItems: dataRangeLength
  };

  return { tableColumns, tableRows, newTablePaginationData };
};
