import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { FeedbackPayload } from "src/insights/redux/types/payload";
import { DashboardVisualizationDataApi } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { FeedbackResponseApi, FeedbackResponseSchema } from "src/insights/redux/types/schemas/applicationAnalytics";

export const feedbackBuilder = (builder: AppDataApiEndpointBuilder) => ({
  feedback: builder.mutation<DashboardVisualizationDataApi, { payload: FeedbackPayload }>({
    query: ({ payload }) => ({
      url: `ApplicationAnalytics`,
      method: "POST",
      body: payload,
      responseHandler: async (response) =>
        await responseValidator<FeedbackResponseApi, false>({
          response,
          schema: FeedbackResponseSchema,
          actionLabel: "post feedback"
        })
    })
  })
});
