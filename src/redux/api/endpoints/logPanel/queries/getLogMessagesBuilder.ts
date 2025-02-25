import { LOG_MESSAGES_LIMIT } from "src/consts/consts";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { LogMessageArray, LogMessageArraySchema } from "src/redux/types/schemas/logMessage";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const getLogMessagesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getLogMessages: builder.query<LogMessageArray, void>({
    query: () => ({
      method: "GET",
      url: `LogMessage?limit=${LOG_MESSAGES_LIMIT}`,
      responseHandler: async (response) =>
        await responseValidator<LogMessageArray, false>({
          response,
          schema: LogMessageArraySchema,
          actionLabel: "get log messages"
        })
    })
  })
});
