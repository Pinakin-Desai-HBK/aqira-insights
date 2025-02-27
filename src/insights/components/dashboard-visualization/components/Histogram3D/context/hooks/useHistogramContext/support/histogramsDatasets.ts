/* eslint-disable @typescript-eslint/no-unused-vars */
import { Histogram3DKey } from "src/insights/redux/types/schemas/dashboardVisualizations";
import {
  FilteredVisualizationProperties,
  VisDataSetDataType,
  DataSetId,
  DataSet,
  DataSetDetails
} from "src/insights/redux/types/ui/dashboardVisualization";
import { GetHistogramData, HistogramChartData, HistogramData } from "../../../../types";
import { QueryDataWithoutSchema } from "src/insights/redux/types/ui/timeSeries";
import { getDataWithoutSchema, getIndexes } from "src/insights/api/Data";
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
  properties: FilteredVisualizationProperties<Histogram3DKey>;
  dashboardId: string;
  visualizationId: string;
  schema: DataSet<"Histogram3D">;
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
}) => Promise<Omit<HistogramChartData, "available"> | null>;

export const updateColumnData: UpdateHistogramData = async (props) => {
  const { dataSetDetails, queryChannelNames, queryIndex } = props;
  const { dashboardId, visualizationId, dataSetId } = dataSetDetails;
  try {
    const dataResult: VisDataSetDataType<Histogram3DKey> | null = await queryHistogramData({
      type: Histogram3DKey,
      dataSetDetails,
      refreshParams: {
        channelNames: queryChannelNames,
        index: queryIndex,
        typeFilter: ["h3axis", "NaN"]
      }
    });

    if (!dataResult) return null;
    const processedDataResult = processDataResult(dataResult);
    return {
      ...processedDataResult
    };
  } catch (error) {
    console.info(
      "VIS",
      `Error getting histogram chart data ${dashboardId} / ${visualizationId} / ${dataSetId}`,
      JSON.stringify(error)
    );
    return null;
  }
};

const getColumnData: GetHistogramData<Histogram3DKey> = async (props) => {
  const { schema, dataSetDetails, properties, queryChannelNames, queryIndex, indexes } = props;
  if (schema.type !== Histogram3DKey) {
    throw new Error(`Schema is invalid`);
  }
  if (schema.state === "Loading") {
    return { state: "Loading" };
  }
  const dataResult: VisDataSetDataType<Histogram3DKey> | null = await queryHistogramData({
    type: Histogram3DKey,
    dataSetDetails,
    refreshParams: {
      channelNames: queryChannelNames,
      index: queryIndex,
      typeFilter: ["h3axis", "NaN"]
    }
  });
  if (!dataResult) return null;
  const processedDataResult = processDataResult(dataResult);
  const result = {
    ...processedDataResult,
    available: {
      channelNames: schema.dataColumns.map((column) => column.name),
      indexes
    }
  };
  return { state: "Loaded", data: result };
};

const queryHistogramData: QueryDataWithoutSchema<Histogram3DKey> = async (props) => {
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

const processDataResult = (dataResult: VisDataSetDataType<Histogram3DKey>) => {
  const {
    histograms: rawHistograms,
    index: { dataBase64, name, type }
  } = dataResult;
  const histograms: HistogramData[] = rawHistograms.map((histogram) => ({
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
      y: histogram.data.y.map((cy) => ({
        start: base64ToDouble(cy.start) ?? 0,
        midPoint: base64ToDouble(cy.midPoint) ?? 0,
        end: base64ToDouble(cy.end) ?? 0,
        label: cy.label
      })),
      yUnits: histogram.data.yUnits,
      yLabel: histogram.data.yLabel,
      z: histogram.data.z.map((cz) => base64ToDouble(cz.value) ?? 0),
      zUnits: histogram.data.zUnits,
      zLabel: histogram.data.zLabel
    }
  }));

  const fullXRange = histograms.reduce(
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
  const fullYRange = histograms.reduce(
    (acc, { data }) => {
      const currentMax = data.y.reduce((acc, { midPoint }) => Math.max(acc, midPoint), Number.MIN_VALUE);
      const currentMin = data.y.reduce((acc, { midPoint }) => Math.min(acc, midPoint), Number.MAX_VALUE);
      return {
        max: Math.max(acc.max, currentMax),
        min: Math.min(acc.min, currentMin)
      };
    },
    { max: Number.MIN_VALUE, min: Number.MAX_VALUE }
  );
  const fullZRange = histograms.reduce(
    (acc, { data }) => {
      const currentMax = data.z.reduce((acc, z) => Math.max(acc, z), Number.MIN_VALUE);
      const currentMin = data.z.reduce((acc, z) => Math.min(acc, z), Number.MAX_VALUE);
      return {
        max: Math.max(acc.max, currentMax),
        min: Math.min(acc.min, currentMin)
      };
    },
    { max: Number.MIN_VALUE, min: Number.MAX_VALUE }
  );
  const averageBinWidth =
    histograms.reduce(
      (acc, { data }) => data.x.reduce((acc, { start, end }) => acc + (end - start), 0) / data.x.length,
      0
    ) / histograms.length;
  const averageBinDepth =
    histograms.reduce(
      (acc, { data }) => data.y.reduce((acc, { start, end }) => acc + (end - start), 0) / data.y.length,
      0
    ) / histograms.length;

  return {
    name,
    currentIndex: {
      averageBinWidth,
      averageBinDepth,
      fullXRange,
      fullYRange,
      fullZRange,
      yRange: { min: 0, max: 0 },
      xRange: { min: 0, max: 0 },
      zRange: { min: 0, max: 0 },
      index: (type === "Double" ? base64ToDouble(dataBase64) : base64ToBigIntToDouble(dataBase64)) ?? 0,
      histograms
    }
  };
};
