import { getConfigHelpers, setStoredChartState } from "./support/storedChartState";
import { Dimensions } from "src/insights/redux/types/redux/workspaces";
import { GetSchema, VIS_ERROR_TYPES } from "src/insights/components/dashboard-visualization/components/Shared/types";
import { fetchChartData, fetchIndexes } from "./support/histogramsDatasets";
import { prepareChartData } from "./support/prepareChartData";
import { ChartData } from "../../../types";

export const initialiseIndexes = async ({
  dataSetId,
  dashboardId,
  visualizationId,
  selectLastIndex
}: {
  dataSetId: string;
  dashboardId: string;
  visualizationId: string;
  selectLastIndex?: boolean;
}) => {
  const selectedIndex = getConfigHelpers({
    dashboardId,
    visualizationId
  }).getSelectedIndex();
  const fetchedIndexes = await fetchIndexes({
    dataSetId
  });
  if (!fetchedIndexes) {
    return "NO_DATA_AVAILABLE";
  }
  const checkedSelectedIndex =
    (selectLastIndex
      ? fetchedIndexes[fetchedIndexes.length - 1]
      : selectedIndex !== null && fetchedIndexes.includes(selectedIndex)
        ? selectedIndex
        : fetchedIndexes[0]) ?? null;
  if (checkedSelectedIndex === null) {
    return "NO_DATA_AVAILABLE";
  }

  setStoredChartState({
    newStoredChartState: { selectedIndex: checkedSelectedIndex },
    dashboardId,
    visualizationId
  });
  return { checkedSelectedIndex, fetchedIndexes };
};

export const initialiseChartData = async ({
  dataSetId,
  getSchema,
  dimensions,
  dashboardId,
  visualizationId
}: {
  dataSetId: string;
  dashboardId: string;
  visualizationId: string;
  getSchema: GetSchema<"Histogram">;
  dimensions: Dimensions | null;
}): Promise<Omit<ChartData, "refs"> | VIS_ERROR_TYPES> => {
  const schema = await getSchema({ dataSetId });
  if (schema.state === "Loading") {
    return "DATA_LOADING";
  }

  const initialiseIndexesResult = await initialiseIndexes({
    dataSetId,
    dashboardId,
    visualizationId
  });
  if (typeof initialiseIndexesResult === "string") {
    return initialiseIndexesResult;
  }
  const { checkedSelectedIndex, fetchedIndexes } = await initialiseIndexesResult;

  const fetchData = async () => {
    try {
      const fetchedData = await fetchChartData({
        dataSetId,
        index: checkedSelectedIndex,
        indexes: fetchedIndexes || [],
        queryChannelNames: [],
        properties: { connection: "absolute", type: "Histogram" },
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
  const fetchedData = await fetchData();
  if (typeof fetchedData === "string") {
    return fetchedData;
  }
  if (!fetchedData || !fetchedIndexes) {
    return "NO_DATA_AVAILABLE";
  }
  if (fetchedData.state === "Loading") {
    return "DATA_LOADING";
  }

  const selectedChannel = getConfigHelpers({
    dashboardId,
    visualizationId
  }).getSelectedChannel();
  const fetchedChannelNames = fetchedData.data.available.channelNames;
  if (fetchedChannelNames.length === 0) {
    return "NO_DATA_AVAILABLE";
  }
  const checkedSelectedChannel =
    (selectedChannel !== null && fetchedChannelNames.includes(selectedChannel)
      ? selectedChannel
      : fetchedChannelNames[0]) ?? null;
  if (checkedSelectedChannel === null) {
    return "NO_DATA_AVAILABLE";
  }

  const chartDataWithoutRefs = prepareChartData({
    histogramChartData: {
      ...fetchedData.data,
      zoomRange: null
    },
    dataSetId,
    storedSelectedChannel: checkedSelectedChannel,
    dimensions
  });
  return chartDataWithoutRefs ?? "NO_DATA_AVAILABLE";
};
