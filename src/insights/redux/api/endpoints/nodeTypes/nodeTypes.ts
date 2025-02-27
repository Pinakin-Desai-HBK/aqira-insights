import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { getNodeTypesBuilder } from "./queries/getNodeTypesBuilder";

export const getNodeTypesApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getNodeTypesBuilder(builder)
});
