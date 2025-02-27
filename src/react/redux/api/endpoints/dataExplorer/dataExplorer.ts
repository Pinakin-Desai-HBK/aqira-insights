import { AIEndpointBuilder } from "src/react/redux/types/redux/redux";
import { getDataFilesBuilder } from "./queries/getDataFilesBuilder";
import { getColumnDetailsBuilder } from "./queries/getColumnDetailsBuilder";
import { getColumnDetailsDataBuilder } from "./queries/getColumnDetailsDataBuilder";

export const getDataExplorerEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getDataFilesBuilder(builder),
  ...getColumnDetailsBuilder(builder),
  ...getColumnDetailsDataBuilder(builder)
});
