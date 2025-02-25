import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { getAboutDataBuilder } from "./queries/getAboutDataBuilder";

export const getAboutDataApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getAboutDataBuilder(builder)
});
