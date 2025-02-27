import { AIEndpointBuilder } from "src/react/redux/types/redux/redux";
import { getVisualizationTypesBuilder } from "./queries/getVisualizationTypesBuilder";

export const getVisualizationTypesApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getVisualizationTypesBuilder(builder)
});
