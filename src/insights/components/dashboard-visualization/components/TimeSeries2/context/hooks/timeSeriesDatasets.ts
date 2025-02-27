import { MAX_TIME_SERIES_TRACES } from "../../../../../../consts/consts";
import { TimeSeriesKey } from "src/insights/redux/types/schemas/dashboardVisualizations";
import {
  DataSet,
  FilteredVisualizationProperties,
  Range,
  VisDataSetDataType
} from "src/insights/redux/types/ui/dashboardVisualization";
import { base64ToDoubleArray, convertToNumbers } from "../../../Shared/hooks/utils/base64ToDoubleArray";
import { QueryData } from "src/insights/redux/types/ui/timeSeries";
import { chartColor } from "./utils/chartColor";
import { base64ToBigIntToDoubleArray } from "../../../Shared/hooks/utils/base64ToBigIntToDoubleArray";
import {
  FetchColumnData,
  GetColumnData,
  LineChartData,
  LineChartDataWithColor,
  ProcessDataSet,
  RefreshColumns,
  RefreshColumnData,
  RequestAndPrepareColumnData
} from "../../types";
import { getData } from "src/insights/api/Data";

export const updateColumnData: RefreshColumns = async ({
  dataSetId,
  range,
  datasetLabels,
  dashboardId,
  visualizationId,
  dimensions,
  properties
}) => {
  if (!dimensions) return null;
  const chartColumnsData = await refreshColumnData({
    width: dimensions.width,
    range,
    dataSetDetails: { dashboardId, dataSetId, visualizationId },
    properties
  });
  if (!chartColumnsData) return null;
  const chartColumnsWithUpdatedLabels = chartColumnsData.map((current, index) => ({
    ...current,
    label: datasetLabels[index] ?? current.label
  }));
  return { chartColumnsWithUpdatedLabels };
};

export const fetchColumnData: FetchColumnData = async ({
  dataSetId,
  visibleRange,
  visualizationId,
  dashboardId,
  dimensions,
  properties,
  schema,
  name
}) => {
  if (!dimensions) return null;
  if (schema.state === "Loading") {
    return { state: "Loading" };
  }
  try {
    const result = await getColumnData({
      dataSetDetails: { dashboardId, dataSetId, visualizationId },
      properties,
      width: dimensions.width,
      visibleRange
    });
    if (!result) return null;
    if (result.state === "Loading") return null;
    const {
      data: { chartColumns: chartColumnsData, xLimits, minimapColumns }
    } = result;

    const {
      chartColumnsWithUpdatedLabels,
      yAxisLabel,
      datasetLabels: datasetLabelsData
    } = processColumnLabels({
      schema,
      chartColumns: chartColumnsData
    });
    if (!chartColumnsWithUpdatedLabels) {
      throw new Error(`Unable to process column labels`);
    }
    return {
      state: "Loaded",
      data: {
        chartProps: {
          xAxisLabel: schema.index.name,
          yAxisLabel: yAxisLabel ?? "Value",
          xLimits,
          name
        },
        datasetLabelsData,
        chartColumnsWithUpdatedLabels,
        minimapColumns
      }
    };
  } catch (error) {
    console.info(
      "VIS",
      `Error getting time series data ${dashboardId} / ${visualizationId} / ${dataSetId}`,
      JSON.stringify(error)
    );
    return null;
  }
};

/*
 * Updates the labels for the datasets to include the units if they are all the same
 *
 *
 */

const processColumnLabels = ({
  schema,
  chartColumns
}: {
  schema: DataSet<"TimeSeries">;
  chartColumns: LineChartData[];
}) => {
  if (schema.state === "Loading") {
    return { state: "Loading" };
  }
  const allDataSetUnits = schema.dataColumns.reduce<{ units: string[]; count: number; used: boolean[] }>(
    (result, dataColumn, index) => {
      const units = dataColumn.units;
      const useUnits = chartColumns[index] && chartColumns[index].data.x.length > 0 ? true : false;

      return {
        count: result.count + (useUnits && result.units.indexOf(units) < 0 ? 1 : 0),
        used: [...result.used, useUnits],
        units: [...result.units, units]
      };
    },
    { units: [], count: 0, used: [] } as { units: string[]; count: number; used: boolean[] }
  );
  const filteredDataSetUnits = allDataSetUnits.units.filter((_, index) => {
    const isCurrentUsed = allDataSetUnits.used[index];
    return isCurrentUsed;
  });
  const yAxisLabel = allDataSetUnits.count === 1 ? filteredDataSetUnits[0] : null;
  const datasetLabels = schema.dataColumns.reduce<string[]>((result, dataColumn, index) => {
    const hasMatch = chartColumns.some((chartColumn) => chartColumn.label === dataColumn.name);
    if (!hasMatch) {
      return result;
    }
    const units = allDataSetUnits.units[index];
    const suffix = !yAxisLabel && !!units && units.length > 0 ? `|split|${units}` : "";
    return [...result, dataColumn.name + suffix];
  }, []);
  const chartColumnsWithUpdatedLabels = applyColumnColours(
    chartColumns.map<LineChartData>((current, index) => ({
      ...current,
      label: datasetLabels[index] ?? current.label
    }))
  );
  return { chartColumnsWithUpdatedLabels, yAxisLabel, datasetLabels };
};

/*
 * Prepares dataset data for the line chart
 *
 *
 */

/*
 * Adds colours to the datasets
 *
 *
 */

const applyColumnColours = <T extends LineChartData>(datasets: T[]): LineChartDataWithColor[] =>
  datasets.map((column, index) => ({
    ...column,
    backgroundColor: chartColor(index),
    borderColor: chartColor(index),
    color: chartColor(index) || "rgba(0, 0, 0, 0.0)"
  }));

/*
 * Support for interacting with the API
 *
 *
 */

const refreshColumnData: RefreshColumnData<TimeSeriesKey> = async ({ range, properties, width, dataSetDetails }) => {
  const newColumnsData = await requestAndPrepareColumnData({
    dataRange: range
      ? {
          range: { start: range.min, end: range.max },
          length: range.max - range.min
        }
      : null,
    dataSetDetails,
    properties,
    pointCount: width
  });

  if (!newColumnsData) {
    return null;
  }

  const processedColumns = applyColumnColours(newColumnsData);
  return processedColumns;
};

const getColumnData: GetColumnData<TimeSeriesKey> = async (props) => {
  const { width, dataSetDetails, properties, visibleRange } = props;

  const columns = await requestAndPrepareColumnData({
    dataRange: null,
    dataSetDetails,
    properties,
    pointCount: width
  });

  if (!columns) {
    throw new Error(`Unable to prepare chart data`);
  }

  const xLimits = columns.reduce<Range | null>(
    (result, current) => ({
      min: result ? Math.min(current.min, result.min) : current.min,
      max: result ? Math.max(current.max, result.max) : current.max
    }),
    null
  );

  if (!xLimits) {
    throw new Error(`Unable to prepare chart data`);
  }

  if (visibleRange) {
    const storedRangeColumns = await requestAndPrepareColumnData({
      dataRange: {
        range: { start: visibleRange.min, end: visibleRange.max },
        length: visibleRange.max - visibleRange.min
      },
      pointCount: width,
      ...props
    });

    if (!storedRangeColumns) {
      throw new Error(`Unable to prepare chart data`);
    }

    return {
      state: "Loaded",
      data: {
        chartColumns: applyColumnColours(storedRangeColumns),
        minimapColumns: applyColumnColours(columns),
        xLimits
      }
    };
  }

  return {
    state: "Loaded",
    data: {
      chartColumns: applyColumnColours(columns),
      minimapColumns: applyColumnColours(columns),
      xLimits,
      zoomRange: null
    }
  };
};

const requestAndPrepareColumnData: RequestAndPrepareColumnData = async ({
  dataRange,
  dataSetDetails,
  properties,
  pointCount
}) => {
  const dataResult: VisDataSetDataType<TimeSeriesKey> | null = await queryColumnData({
    type: TimeSeriesKey,
    properties,
    dataSetDetails,
    refreshParams: {
      startIndex: dataRange?.range.start ?? null,
      endIndex: dataRange?.range.end ?? null,
      columnsFilters: null,
      pointCount,
      maxColumnCount: -1
    }
  });

  if (!dataResult) return null;

  const { dataSetId } = dataSetDetails;
  const columns: LineChartData[] | null = processColumnDataResult({
    columnNames: dataResult.columns.map((column, index) => column?.name ?? `Column ${index}`),
    dataResult,
    dataSetId,
    range: dataRange ? { min: dataRange.range.start, max: dataRange.range.end } : null
  });
  return columns;
};

const queryColumnData: QueryData<TimeSeriesKey> = async (props) => {
  const { dataSetDetails, refreshParams, properties, type } = props;
  const { numtraces } = properties as FilteredVisualizationProperties<typeof type>;
  const maxColumnCount = numtraces && numtraces >= 1 && numtraces <= 32 ? numtraces : MAX_TIME_SERIES_TRACES;
  const dataResult = await getData({
    payload: {
      $queryType: "windowed",
      ...refreshParams,
      maxColumnCount
    },
    visType: type,
    dataSetId: dataSetDetails.dataSetId
  });
  return dataResult;
};

const processColumnDataResult: ProcessDataSet = (props) => {
  const { columnNames, dataResult, dataSetId, range } = props;
  const {
    index: { type, dataBase64 }
  } = dataResult;
  const indexArray = type === "Double" ? base64ToDoubleArray(dataBase64) : base64ToBigIntToDoubleArray(dataBase64);
  const min = Math.min(...indexArray);
  const max = Math.max(...indexArray);

  const firstIndexesInRange: { left: number; right: number } = {
    left: -1,
    right: indexArray.length
  };
  if (range) {
    while (
      indexArray[firstIndexesInRange.left + 1] !== undefined &&
      indexArray[firstIndexesInRange.left + 1]! < range.min
    ) {
      firstIndexesInRange.left += 1;
    }
    while (
      indexArray[firstIndexesInRange.right - 1] !== undefined &&
      indexArray[firstIndexesInRange.right - 1]! > range.max
    ) {
      firstIndexesInRange.right -= 1;
    }
  }

  const start = firstIndexesInRange.left > -1 ? firstIndexesInRange.left : 0;
  //const end = firstIndexesInRange.right < indexArray.length ? firstIndexesInRange.right : indexArray.length;
  //const processedIndexArray = indexArray.slice(start, end);

  //const start = firstIndexesInRange.left - 1 > -1 ? firstIndexesInRange.left - 1 : 0;
  const end = firstIndexesInRange.right + 1 < indexArray.length ? firstIndexesInRange.right + 1 : indexArray.length;
  const processedIndexArray = indexArray.slice(start, end);

  const columns = dataResult.columns.reduce<LineChartData[]>((result, column, columnIndex) => {
    const label = columnNames[columnIndex] ?? "";
    const { type, dataBase64 } = column;
    const converted = type === "Double" ? base64ToDoubleArray(dataBase64) : base64ToBigIntToDoubleArray(dataBase64);
    const processedConverted = converted.slice(start, end);
    return [
      ...result,
      {
        min,
        max,
        label,
        data: {
          x: processedIndexArray,
          y: convertToNumbers(processedConverted)
        },

        dataSetId
      }
    ];
  }, []);
  return columns;
};
