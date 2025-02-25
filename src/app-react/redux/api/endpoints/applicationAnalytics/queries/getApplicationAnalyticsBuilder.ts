import { responseValidator } from "src/redux/api/utils/responseValidator";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { ApplicationAnalytics, ApplicationAnalyticsSchema } from "src/redux/types/schemas/applicationAnalytics";

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
