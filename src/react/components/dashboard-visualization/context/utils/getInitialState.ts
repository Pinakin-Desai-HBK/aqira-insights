import { DataVisTypes, FilteredVisualizationProperties } from "src/react/redux/types/ui/dashboardVisualization";

export const getInitialState = <T extends DataVisTypes>(params: {
  dashboardId: string;
  properties: FilteredVisualizationProperties<T>;
  visualizationId: string;
}) => {
  return {
    ...params,
    datasets: null,
    schemaStore: null,
    onDataSetUpdatedCallback: null,
    hasConnection: !!params.properties.connection,
    hasError: false,
    errorCode: null,
    connectionIsEmpty: true
  };
};
