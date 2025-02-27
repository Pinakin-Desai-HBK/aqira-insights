import { EmptyResponse, EmptyResponseSchema } from "src/insights/api/api-utils";
import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";

export const clearLogMessagesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  clearLogMessages: builder.mutation<EmptyResponse, void>({
    query: () => ({
      method: "DELETE",
      url: "LogMessage",
      responseHandler: async (response) =>
        await responseValidator<EmptyResponse, false>({
          response,
          schema: EmptyResponseSchema,
          actionLabel: "delete log messages"
        })
    })
  })
});
