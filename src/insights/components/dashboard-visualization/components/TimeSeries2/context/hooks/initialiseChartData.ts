import { Dimensions } from "src/insights/redux/types/redux/workspaces";
import { GetSchema, VIS_ERROR_TYPES } from "src/insights/components/dashboard-visualization/components/Shared/types";
import { ChartData } from "../../types";
import { fetchColumnData } from "./timeSeriesDatasets";
import { getConfigHelpers } from "./utils/storedChartState";
import { withinRange } from "./utils/withinRange";
import { FilteredVisualizationProperties, Range } from "src/insights/redux/types/ui/dashboardVisualization";
import { TimeSeriesKey } from "src/insights/redux/types/schemas/dashboardVisualizations";

export const initialiseChartData = async ({
  dataSetId,
  getSchema,
  dimensions,
  dashboardId,
  visualizationId,
  name,
  properties
}: {
  dataSetId: string;
  dashboardId: string;
  visualizationId: string;
  getSchema: GetSchema<"TimeSeries">;
  dimensions: Dimensions | null;
  name: string;
  properties: FilteredVisualizationProperties<TimeSeriesKey>;
}): Promise<
  | Pick<
      ChartData,
      "range" | "fullRange" | "datasetLabels" | "chartColumns" | "minimapChartColumns" | "xAxisLabel" | "yAxisLabel"
    >
  | VIS_ERROR_TYPES
> => {
  const schema = await getSchema({ dataSetId });
  if (schema.state === "Loading") {
    return "DATA_LOADING";
  }
  if (dimensions === null) {
    return "NO_DATA_AVAILABLE";
  }

  const fetchData = async ({ range }: { range: Range | null }) => {
    try {
      const fetchedData = await fetchColumnData({
        dataSetId,
        dimensions,
        name,
        visibleRange: range,
        properties,
        dashboardId,
        schema,
        visualizationId
      });
      return fetchedData ?? "NO_DATA_AVAILABLE";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.details && "status" in error.details && error.details.status.toString() === "500") {
        return "DATA_INVALID";
      }
      console.info(
        "VIS",
        `Error getting histogram chart data ${dashboardId} / ${visualizationId} / ${dataSetId}`,
        JSON.stringify(error)
      );
      return "NO_DATA_AVAILABLE";
    }
  };
  const fetchedDataMinimap = await fetchData({ range: null });
  if (typeof fetchedDataMinimap === "string") {
    return fetchedDataMinimap;
  }
  if (!fetchedDataMinimap) {
    return "NO_DATA_AVAILABLE";
  }
  if (fetchedDataMinimap.state === "Loading") {
    return "DATA_LOADING";
  }

  const {
    chartProps: { xLimits: minimapXlimits },
    chartColumnsWithUpdatedLabels: minimapChartColumnsWithUpdatedLabels
  } = fetchedDataMinimap.data;

  const range = getConfigHelpers({ dashboardId, visualizationId }).getRange();

  const checkedRange = range
    ? {
        min: withinRange(range.min, minimapXlimits) ? range.min : minimapXlimits.min,
        max: withinRange(range.max, minimapXlimits) ? range.max : minimapXlimits.max
      }
    : null;

  const fetchedData = await fetchData({ range: checkedRange });
  if (typeof fetchedData === "string") {
    return fetchedData;
  }
  if (!fetchedData) {
    return "NO_DATA_AVAILABLE";
  }
  if (fetchedData.state === "Loading") {
    return "DATA_LOADING";
  }

  const {
    data: {
      chartProps: { xLimits, xAxisLabel, yAxisLabel },
      datasetLabelsData,
      chartColumnsWithUpdatedLabels
    }
  } = fetchedData;

  return {
    range: checkedRange || xLimits,
    fullRange: xLimits,
    datasetLabels: datasetLabelsData,
    chartColumns: chartColumnsWithUpdatedLabels,
    minimapChartColumns: minimapChartColumnsWithUpdatedLabels,
    xAxisLabel: xAxisLabel,
    yAxisLabel: yAxisLabel
  };
};
