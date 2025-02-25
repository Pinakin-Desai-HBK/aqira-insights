import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { createDashboardVisualizationBuilder } from "./mutations/createDashboardVisualizationBuilder";

export const getDashboardVisualizationApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...createDashboardVisualizationBuilder(builder)
});
