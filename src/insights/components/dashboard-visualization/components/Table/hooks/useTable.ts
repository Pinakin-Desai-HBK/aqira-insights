import { Context, useCallback, useContext, useEffect, useState } from "react";
import { VisualizationDataContext } from "../../../context/VisualizationDataContext";
import {
  StatelessVisDataSetType,
  VisualizationDataContextData
} from "src/insights/redux/types/ui/dashboardVisualization";
import { TableKey } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { useConnectVisualization } from "../../../hooks/useConnectVisualization";
import { SignalRDataSetUpdatedEvent } from "src/insights/redux/types/system/signalR";
import {
  HistogramTableAxis,
  HistogramTableInfo,
  TableData,
  TablePaginationData,
  TablePageChangeType
} from "src/insights/redux/types/ui/table";
import { VisualizationDetailsContext } from "../../../context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";
import { defaultHistogramTableInfo, defaultTableData, defaultTablePaginationData } from "src/insights/consts/consts";
import { getHistogramTableData } from "../helpers/get-histogram-table-data";
import { getNewPageNumber } from "../helpers/get-new-page-number";
import { getNumberTableData } from "../helpers/get-number-table-data";
import { getData } from "src/insights/api/Data";
import Papa from "papaparse";

export const useTable = () => {
  const { properties } = useContext(VisualizationDetailsContext) as VisualizationDetails<TableKey>;
  const { datasets, getSchema, getDataRange, setOnDataSetUpdatedCallback, hasError } = useContext(
    VisualizationDataContext as Context<VisualizationDataContextData<TableKey>>
  );
  const { onDragOver, onDrop } = useConnectVisualization();
  const [tableData, setTableData] = useState<TableData>(defaultTableData);
  const [dataSetId, setDataSetId] = useState<string | null>(null);
  const [displayHistogramTable, setDisplayHistogramTable] = useState(false);
  const [histogramTableInfo, setHistogramTableInfo] = useState<HistogramTableInfo>(defaultHistogramTableInfo);
  const [tablePaginationData, setTablePaginationData] = useState<TablePaginationData>(defaultTablePaginationData);

  const clearVisualization = useCallback(() => {
    setTableData(defaultTableData);
  }, []);

  const getNumTableData = useCallback(
    async (dataSetId: string, pageNumber: number, schema: StatelessVisDataSetType<TableKey>) => {
      const { length: dataRangeLength } = await getDataRange(dataSetId);
      let newRowsPerPage = tableData.rowsPerPage;
      let newPageNumber = pageNumber;

      // Check if the rows per page proprty has changed
      if (newRowsPerPage !== properties.rowsperpage) {
        newRowsPerPage = properties.rowsperpage;
        newPageNumber = 1;
      }

      const { tableColumns, tableRows, newTablePaginationData } = await getNumberTableData(
        schema,
        dataSetId,
        newRowsPerPage,
        newPageNumber,
        tablePaginationData,
        dataRangeLength
      );

      setTableData({
        ...tableData,
        pageNumber: newPageNumber,
        rowsPerPage: newRowsPerPage,
        dataSetId,
        tableColumns,
        tableRows
      });

      setTablePaginationData(newTablePaginationData);
    },
    [tableData, properties.rowsperpage, tablePaginationData, getDataRange]
  );

  const getHistTableData = useCallback(
    async ({ selectedChannel, selectedIndex, axis }: HistogramTableInfo) => {
      if (dataSetId && selectedChannel && selectedIndex !== null && axis) {
        const { tableColumns, tableRows } = await getHistogramTableData(
          dataSetId,
          selectedChannel,
          selectedIndex,
          axis
        );

        setTableData((prev) => ({
          ...prev,
          dataSetId,
          tableColumns,
          tableRows,
          rowsPerPage: 100 // Maximum allowed with MIT version of Data Grid
        }));
      }
    },
    [dataSetId]
  );

  const setupHistogramTable = useCallback(
    async (histogramColumns: { name: string }[]) => {
      if (dataSetId) {
        const dataResult = await getData({
          dataSetId: dataSetId,
          visType: "Table",
          payload: { $queryType: "paged", pageNumber: 1, pageSize: 1000000 }
        });

        if (dataResult === null) {
          throw new Error(`Data is null`);
        }

        const rows: string[][] = Papa.parse(dataResult.data).data as string[][];
        rows.pop();
        const indexes = rows.map((row) => Number(row[0]!));

        setHistogramTableInfo({
          ...histogramTableInfo,
          axis: rows[0]!.filter((row) => row === "h2axis" || row === "h3axis")[0] as HistogramTableAxis,
          channelNames: histogramColumns.map((column) => column.name),
          indexes: new Float64Array(indexes),
          selectedIndex: indexes[0]!,
          selectedChannel: histogramColumns[0]!.name,
          marksData: {
            marks: indexes.map((index) => ({ value: index, label: index.toString() })),
            min: indexes[0]!,
            max: indexes[indexes.length - 1]!
          },
          maxMarkCharacters: indexes.sort((a, b) => b.toString().length - a.toString().length)[0]!.toString().length,
          setSelectedChannel: (channel) => setHistogramTableInfo((prev) => ({ ...prev, selectedChannel: channel })),
          setSelectedIndex: (index) => setHistogramTableInfo((prev) => ({ ...prev, selectedIndex: index }))
        });
      }
    },
    [dataSetId, histogramTableInfo]
  );

  const getTableData = useCallback(
    async (dataSetId: string, pageNumber: number) => {
      try {
        const schema = (await getSchema({ dataSetId })) as StatelessVisDataSetType<TableKey>;

        if (schema.type !== TableKey) {
          throw new Error(`Schema is invalid"}`);
        }

        const histogramColumns = schema.dataColumns.filter((column) => column.type === "Histogram");

        if (histogramColumns.length === 0) {
          getNumTableData(dataSetId, pageNumber, schema);
        } else {
          setDisplayHistogramTable(true);
          setupHistogramTable(histogramColumns);
        }
      } catch {
        clearVisualization();
      }
    },
    [getNumTableData, getSchema, setupHistogramTable, clearVisualization]
  );

  const onPageChange = useCallback(
    (pageChangeType: TablePageChangeType) => {
      const pageNumber = getNewPageNumber(
        pageChangeType,
        tableData.pageNumber,
        tablePaginationData.totalNumberOfItems,
        tableData.rowsPerPage
      );
      getTableData(tableData.dataSetId!, pageNumber);
    },
    [tableData, tablePaginationData, getTableData]
  );

  useEffect(() => {
    tablePaginationData.onPageChange = onPageChange;
  }, [tablePaginationData, onPageChange]);

  useEffect(() => {
    setOnDataSetUpdatedCallback(
      async ({ message: { dataSetId: updatedDatasetId } }: { message: SignalRDataSetUpdatedEvent }) => {
        if (updatedDatasetId !== dataSetId) return;
        getTableData(dataSetId, tableData.pageNumber);
      }
    );
    const newDataSetId: string | null = datasets !== null && datasets[0] ? datasets[0] : null;
    if (newDataSetId === null || newDataSetId === dataSetId) {
      return;
    }
    setDataSetId(newDataSetId);
  }, [dataSetId, datasets, setOnDataSetUpdatedCallback, getTableData, tableData.pageNumber]);

  useEffect(() => {
    if (
      dataSetId &&
      (!tableData ||
        dataSetId !== tableData.dataSetId ||
        (!displayHistogramTable && tableData.rowsPerPage !== properties.rowsperpage))
    ) {
      clearVisualization();
      getTableData(dataSetId, tableData.pageNumber);
    }
  }, [tableData, dataSetId, clearVisualization, getTableData, properties.rowsperpage, displayHistogramTable]);

  useEffect(() => {
    if (hasError) clearVisualization();
  }, [hasError, clearVisualization]);

  useEffect(() => {
    getHistTableData(histogramTableInfo);
  }, [histogramTableInfo, getHistTableData]);

  return { displayHistogramTable, histogramTableInfo, tableData, tablePaginationData, onDragOver, onDrop };
};
