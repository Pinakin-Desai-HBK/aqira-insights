import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { getNetworkConnectionsBuilder } from "./queries/getNetworkConnectionsBuilder";
import { createNetworkConnectionBuilder } from "./mutations/createNetworkConnectionBuilder";
import { deleteNetworkConnectionBuilder } from "./mutations/deleteNetworkConnectionBuilder";

export const getNetworkConnectionApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getNetworkConnectionsBuilder(builder),
  ...createNetworkConnectionBuilder(builder),
  ...deleteNetworkConnectionBuilder(builder)
});
