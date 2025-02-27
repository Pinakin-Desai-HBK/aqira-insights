import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { FeedbackPayload } from "src/react/redux/types/payload";
import { DashboardVisualizationDataApi } from "src/react/redux/types/schemas/dashboardVisualizations";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";
import { FeedbackResponseApi, FeedbackResponseSchema } from "src/react/redux/types/schemas/applicationAnalytics";

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
