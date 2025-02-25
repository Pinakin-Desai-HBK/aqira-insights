import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { clearLogMessagesBuilder } from "./mutations/clearLogMessagesBuilder";
import { getLogMessagesBuilder } from "./queries/getLogMessagesBuilder";

export const getLogPanelApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getLogMessagesBuilder(builder),
  ...clearLogMessagesBuilder(builder)
});
