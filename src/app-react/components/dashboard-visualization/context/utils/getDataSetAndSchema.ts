import { getDataSets, getSchema } from "src/api/Data";
import { APIError } from "src/redux/api/utils/responseValidator";
import {
  DataSetSchemaStore,
  DataVisTypes,
  getDataSetSchema,
  VisualizationDataContextState
} from "src/redux/types/ui/dashboardVisualization";

const DataVisDataSetTypeMap: Record<DataVisTypes, "stateful" | "stateless"> = {
  Histogram: "stateful",
  Table: "stateless",
  TimeSeries: "stateful",
  Histogram3D: "stateful"
};

export const getDataSetAndSchema = async ({
  dashboardId,
  visualizationId,
  type
}: {
  dashboardId: string;
  visualizationId: string;
  type: DataVisTypes;
}): Promise<Pick<VisualizationDataContextState<DataVisTypes>, "datasets" | "schemaStore"> | APIError | null> => {
  try {
    const validationSchema = getDataSetSchema(type);
    const datasetsResult = await getDataSets({ dashboardId, visualizationId });

    // Get the schema for each dataset
    const schemaResult: DataSetSchemaStore<typeof type>[] = await Promise.all(
      datasetsResult.map(async (dataSetId) => {
        try {
          const schema = await getSchema({ dataSetId });

          if (schema === null && DataVisDataSetTypeMap[type] === "stateless") {
            return {};
          }
          return {
            [dataSetId]:
              schema === null
                ? { type, state: "Loading" }
                : { ...validationSchema.parse({ ...schema, type, state: "Loaded" }) }
          };
        } catch (e) {
          console.info("VIS", "DataSet schema validation failed with error: ", JSON.stringify(e));
          return DataVisDataSetTypeMap[type] === "stateless"
            ? {}
            : {
                [dataSetId]: { type, state: "Loading" }
              };
        }
      })
    );

    // Combine the schema for each dataset into a single store
    const schemaStoreResult: DataSetSchemaStore<typeof type> = schemaResult?.reduce(
      (result, entry) => ({ ...result, ...entry }),
      {}
    );

    return {
      datasets: datasetsResult,
      schemaStore: schemaStoreResult
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.details && "status" in e.details && e.details.status.toString() === "404") {
      return null;
    }
    if (e.details && "type" in e.details && e.details.type === "api_error") {
      return e.details;
    }
    console.info("VIS", "DataSet schema validation failed with error: ", JSON.stringify(e));
    return null;
  }
};
