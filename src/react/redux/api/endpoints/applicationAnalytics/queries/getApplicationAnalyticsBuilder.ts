import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";
import { ApplicationAnalytics, ApplicationAnalyticsSchema } from "src/react/redux/types/schemas/applicationAnalytics";

export const getApplicationAnalyticsBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getApplicationAnalytics: builder.query<ApplicationAnalytics, void>({
    query: () => ({
      url: `ApplicationAnalytics`,
      responseHandler: async (response) =>
        await responseValidator<ApplicationAnalytics, false>({
          response,
          schema: ApplicationAnalyticsSchema,
          actionLabel: "get application analytics"
        })
    }),
    providesTags: ["ApplicationAnalytics"]
  })
});
