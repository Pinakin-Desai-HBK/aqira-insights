import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { getApplicationAnalyticsBuilder } from "./queries/getApplicationAnalyticsBuilder";
import { feedbackBuilder } from "./mutations/feedbackBuilder";

export const getApplicationAnalyticsApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getApplicationAnalyticsBuilder(builder),
  ...feedbackBuilder(builder)
});
