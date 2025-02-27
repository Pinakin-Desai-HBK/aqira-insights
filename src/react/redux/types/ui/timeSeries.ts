import {
  DataSetDetails,
  DataSetRefreshParams,
  DataVisTypes,
  FilteredVisualizationProperties,
  VisDataSetDataType
} from "src/react/redux/types/ui/dashboardVisualization";

type CommonParams<T extends DataVisTypes> = {
  dataSetDetails: DataSetDetails;
  properties: FilteredVisualizationProperties<T>;
};

type QueryDataParams<T extends DataVisTypes> = CommonParams<T> & {
  type: T;
  refreshParams: Omit<DataSetRefreshParams<T>, "$queryType">;
};

export type QueryData<T extends DataVisTypes> = (params: QueryDataParams<T>) => Promise<VisDataSetDataType<T> | null>;

type QueryDataWithoutSchemaParams<T extends DataVisTypes> = {
  dataSetDetails: DataSetDetails;
  type: T;
  refreshParams: Omit<DataSetRefreshParams<T>, "$queryType">;
};

export type QueryDataWithoutSchema<T extends DataVisTypes> = (
  params: QueryDataWithoutSchemaParams<T>
) => Promise<VisDataSetDataType<T> | null>;
