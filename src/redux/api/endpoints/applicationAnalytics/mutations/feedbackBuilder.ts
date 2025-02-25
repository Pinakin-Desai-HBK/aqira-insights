import { responseValidator } from "src/redux/api/utils/responseValidator";
import { FeedbackPayload } from "src/redux/types/payload";
import { DashboardVisualizationDataApi } from "src/redux/types/schemas/dashboardVisualizations";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { FeedbackResponseApi, FeedbackResponseSchema } from "src/redux/types/schemas/applicationAnalytics";

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
