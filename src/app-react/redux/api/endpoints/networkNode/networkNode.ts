import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { createNetworkNodeBuilder } from "./mutations/createNetworkNodeBuilder";

export const getNetworkNodeApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...createNetworkNodeBuilder(builder)
});
