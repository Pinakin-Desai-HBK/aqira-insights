import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { createDashboardVisualizationBuilder } from "./mutations/createDashboardVisualizationBuilder";

export const getDashboardVisualizationApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...createDashboardVisualizationBuilder(builder)
});
