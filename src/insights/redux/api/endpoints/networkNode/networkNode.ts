import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { createNetworkNodeBuilder } from "./mutations/createNetworkNodeBuilder";

export const getNetworkNodeApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...createNetworkNodeBuilder(builder)
});
