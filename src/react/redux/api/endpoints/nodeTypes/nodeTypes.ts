import { AIEndpointBuilder } from "src/react/redux/types/redux/redux";
import { getNodeTypesBuilder } from "./queries/getNodeTypesBuilder";

export const getNodeTypesApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getNodeTypesBuilder(builder)
});
