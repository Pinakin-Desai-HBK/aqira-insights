import { AIEndpointBuilder } from "src/react/redux/types/redux/redux";
import { getNetworkRunListBuilder } from "./queries/getNetworkRunListBuilder";
import { startNetworkRunBuilder } from "./mutations/startNetworkRunBuilder";
import { abortNetworkRunBuilder } from "./mutations/abortNetworkRunBuilder";

export const getNetworkRunApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getNetworkRunListBuilder(builder),
  ...startNetworkRunBuilder(builder),
  ...abortNetworkRunBuilder(builder)
});
