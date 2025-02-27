import { z } from "zod";
import { DataRangeSchema, DataSetArray, DataSetArraySchema } from "../redux/types/schemas/data";
import { ApiMethod, apiRequestDashboard, apiRequestDataSets, apiRequestDataSetsWithoutSchema } from "./api-utils";
import {
  DataVisTypes,
  VisDataSetDataType,
  VisIndexMapType,
  VisZodSchemaMap
} from "src/react/redux/types/ui/dashboardVisualization";
import { HistogramKey } from "src/react/redux/types/schemas/dashboardVisualizations";

export const getDataSets = async ({ dashboardId, visualizationId }: { dashboardId: string; visualizationId: string }) =>
  apiRequestDashboard<DataSetArray>({
    method: ApiMethod.Get,
    label: "visualization data sets",
    target: `${dashboardId}/Visualization/${visualizationId}/DataSet`,
    schema: DataSetArraySchema
  });

export const getRange = async (dataSetId: string) =>
  apiRequestDataSets({
    method: ApiMethod.Get,
    label: "visualization data range",
    target: `${dataSetId}`,
    schema: DataRangeSchema
  });

export const getData = async <P extends Record<string, unknown>, T extends DataVisTypes>({
  dataSetId,
  payload,
  visType
}: {
  payload: P;
  dataSetId: string;
  visType: T;
}) =>
  apiRequestDataSets<VisDataSetDataType<T>>({
    payload,
    method: ApiMethod.Post,
    label: "visualization data",
    target: `${dataSetId}/Query`,
    schema: VisZodSchemaMap[visType]["dataSetDataSchema"]
  });

export const getDataWithoutSchema = async <P extends Record<string, unknown>, T extends DataVisTypes>({
  dataSetId,
  payload
}: {
  payload: P;
  dataSetId: string;
  visType: T;
}) =>
  apiRequestDataSetsWithoutSchema<VisDataSetDataType<T>>({
    payload,
    method: ApiMethod.Post,
    label: "visualization data",
    target: `${dataSetId}/Query`
  });

export const getIndexes = async ({ dataSetId }: { dataSetId: string }) =>
  apiRequestDataSets<VisIndexMapType<HistogramKey>>({
    payload: {
      $queryType: "index"
    },
    method: ApiMethod.Post,
    label: "visualization data",
    target: `${dataSetId}/Query`,
    schema: VisZodSchemaMap[HistogramKey]["index"]
  });

export const getSchema = async ({ dataSetId }: { dataSetId: string }) =>
  apiRequestDataSets({
    method: ApiMethod.Get,
    label: "visualization data schema",
    target: `${dataSetId}/Schema`,
    schema: z.any()
  });
