import { AIEndpointBuilder } from "src/react/redux/types/redux/redux";
import { getDisplayNodesBuilder } from "./queries/getDisplayNodesBuilder";

export const getDisplayNodesApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getDisplayNodesBuilder(builder)
});
