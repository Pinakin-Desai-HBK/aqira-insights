import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { getVisualizationTypesBuilder } from "./queries/getVisualizationTypesBuilder";

export const getVisualizationTypesApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getVisualizationTypesBuilder(builder)
});
