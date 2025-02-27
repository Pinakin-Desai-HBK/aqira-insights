/* eslint-disable @typescript-eslint/no-unused-vars */
import { HistogramKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import {
  FilteredVisualizationProperties,
  VisDataSetDataType,
  DataSetId,
  DataSet,
  DataSetDetails
} from "src/react/redux/types/ui/dashboardVisualization";
import { GetHistogramData, HistogramChartData } from "../../../../types";
import { QueryDataWithoutSchema } from "src/react/redux/types/ui/timeSeries";
import { getDataWithoutSchema, getIndexes } from "src/react/api/Data";
import {
  base64ToDouble,
  base64ToDoubleArray,
  convertToNumbers
} from "../../../../../Shared/hooks/utils/base64ToDoubleArray";
import {
  base64ToBigIntToDouble,
  base64ToBigIntToDoubleArray
} from "../../../../../Shared/hooks/utils/base64ToBigIntToDoubleArray";

export const fetchChartData = async ({
  dataSetId,
  index,
  indexes,
  properties,
  queryChannelNames,
  dashboardId,
  visualizationId,
  schema
}: {
  dataSetId: string;
  index: number;
  indexes: Float64Array;
  queryChannelNames: string[];
  properties: FilteredVisualizationProperties<HistogramKey>;
  dashboardId: string;
  visualizationId: string;
  schema: DataSet<"Histogram">;
}) => {
  try {
    return getColumnData({
      schema,
      dataSetDetails: { dataSetId, dashboardId, visualizationId },
      properties,
      queryChannelNames,
      queryIndex: index,
      indexes
    });
  } catch (error) {
    console.info(
      "VIS",
      `Error getting histogram chart data ${dashboardId} / ${visualizationId} / ${dataSetId}`,
      JSON.stringify(error)
    );
    return null;
  }
};

export const fetchIndexes = async ({ dataSetId }: { dataSetId: string }): Promise<Float64Array | null> => {
  const result = await queryHistogramIndex(dataSetId);
  if (result) {
    const {
      index: { dataBase64, type }
    } = result;
    return convertToNumbers(
      type === "Double" ? base64ToDoubleArray(dataBase64) : base64ToBigIntToDoubleArray(dataBase64)
    );
  }
  return null;
};

// HANDLE UPDATED DATASET
export type UpdateHistogramData = (params: {
  dataSetDetails: DataSetDetails;
  queryChannelNames: string[] | null;
  queryIndex: number | null;
}) => Promise<Omit<HistogramChartData, "available" | "zoomRange"> | null>;

export const updateColumnData: UpdateHistogramData = async (props) => {
  const { dataSetDetails, queryChannelNames, queryIndex } = props;
  const { dashboardId, visualizationId, dataSetId } = dataSetDetails;
  try {
    const dataResult: VisDataSetDataType<HistogramKey> | null = await queryHistogramData({
      type: HistogramKey,
      dataSetDetails,
      refreshParams: {
        channelNames: queryChannelNames,
        index: queryIndex,
        typeFilter: ["h2axis", "NaN"]
      }
    });

    if (!dataResult) return null;

    const {
      histograms: rawHistograms,
      index: { dataBase64, name, type }
    } = dataResult;
    const histograms = rawHistograms.map((histogram) => ({
      chanName: histogram.chanName,
      type: histogram.type,
      data: {
        x: histogram.data.x.map((cx) => ({
          start: base64ToDouble(cx.start) ?? 0,
          midPoint: base64ToDouble(cx.midPoint) ?? 0,
          end: base64ToDouble(cx.end) ?? 0,
          label: cx.label
        })),
        xUnits: histogram.data.xUnits,
        xLabel: histogram.data.xLabel,
        y: histogram.data.y.map((cy) => base64ToDouble(cy.value) ?? 0),
        yUnits: histogram.data.yUnits,
        yLabel: histogram.data.yLabel
      }
    }));

    const range = histograms.reduce(
      (acc, { data }) => {
        const currentMax = data.x.reduce((acc, { start }) => Math.max(acc, start), Number.MIN_VALUE);
        const currentMin = data.x.reduce((acc, { end }) => Math.min(acc, end), Number.MAX_VALUE);
        return {
          max: Math.max(acc.max, currentMax),
          min: Math.min(acc.min, currentMin)
        };
      },
      { max: Number.MIN_VALUE, min: Number.MAX_VALUE }
    );

    const extent = range.max - range.min;
    const padding = extent * 0.025;
    range.min = Math.floor(range.min - padding);
    range.max = Math.ceil(range.max + padding);

    const averageBinWidth =
      histograms.reduce(
        (acc, { data }) => data.x.reduce((acc, { start, end }) => acc + (end - start), 0) / data.x.length,
        0
      ) / histograms.length;

    const result = {
      name,

      currentIndex: {
        averageBinWidth,
        range,
        index: (type === "Double" ? base64ToDouble(dataBase64) : base64ToBigIntToDouble(dataBase64)) ?? 0,
        dataSetId,
        histograms
      }
    };
    return result;
  } catch (error) {
    console.info(
      "VIS",
      `Error getting histogram chart data ${dashboardId} / ${visualizationId} / ${dataSetId}`,
      JSON.stringify(error)
    );
    return null;
  }
};

const getColumnData: GetHistogramData<HistogramKey> = async (props) => {
  const { schema, dataSetDetails, properties, queryChannelNames, queryIndex, indexes } = props;
  const { dataSetId } = dataSetDetails;

  if (schema.type !== HistogramKey) {
    throw new Error(`Schema is invalid`);
  }
  if (schema.state === "Loading") {
    return { state: "Loading" };
  }

  const dataResult: VisDataSetDataType<HistogramKey> | null = await queryHistogramData({
    type: HistogramKey,
    dataSetDetails,
    refreshParams: {
      channelNames: queryChannelNames,
      index: queryIndex,
      typeFilter: ["h2axis", "NaN"]
    }
  });

  if (!dataResult) return null;

  const {
    histograms: rawHistograms,
    index: { dataBase64, name, type }
  } = dataResult;

  const histograms = rawHistograms.map((histogram) => ({
    chanName: histogram.chanName,
    type: histogram.type,
    data: {
      x: histogram.data.x.map((cx) => ({
        start: base64ToDouble(cx.start) ?? 0,
        midPoint: base64ToDouble(cx.midPoint) ?? 0,
        end: base64ToDouble(cx.end) ?? 0,
        label: cx.label
      })),
      xUnits: histogram.data.xUnits,
      xLabel: histogram.data.xLabel,
      y: histogram.data.y.map((cy) => base64ToDouble(cy.value) ?? 0),
      yUnits: histogram.data.yUnits,
      yLabel: histogram.data.yLabel
    }
  }));

  const range = histograms.reduce(
    (acc, { data }) => {
      const currentMax = data.x.reduce((acc, { start }) => Math.max(acc, start), Number.MIN_VALUE);
      const currentMin = data.x.reduce((acc, { end }) => Math.min(acc, end), Number.MAX_VALUE);
      return {
        max: Math.max(acc.max, currentMax),
        min: Math.min(acc.min, currentMin)
      };
    },
    { max: Number.MIN_VALUE, min: Number.MAX_VALUE }
  );
  const extent = range.max - range.min;
  const padding = extent * 0.025;
  range.min = Math.floor(range.min - padding);
  range.max = Math.ceil(range.max + padding);
  const averageBinWidth =
    histograms.reduce(
      (acc, { data }) => data.x.reduce((acc, { start, end }) => acc + (end - start), 0) / data.x.length,
      0
    ) / histograms.length;

  const result = {
    name,
    available: {
      channelNames: schema.dataColumns.map((column) => column.name),
      indexes
    },
    currentIndex: {
      averageBinWidth,
      range,
      index: (type === "Double" ? base64ToDouble(dataBase64) : base64ToBigIntToDouble(dataBase64)) ?? 0,
      dataSetId,
      histograms
    }
  };
  return { state: "Loaded", data: result };
};

const queryHistogramData: QueryDataWithoutSchema<HistogramKey> = async (props) => {
  const { dataSetDetails, refreshParams, type } = props;
  const dataResult = await getDataWithoutSchema({
    payload: {
      $queryType: "absoluteHistogram",
      ...refreshParams
    },
    visType: type,
    dataSetId: dataSetDetails.dataSetId
  });
  return dataResult;
};

const queryHistogramIndex = async (dataSetId: string) => {
  const dataResult = await getIndexes({
    dataSetId
  });
  return dataResult;
};
