import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { AIEndpointBuilder } from "src/react/redux/types/redux/redux";
import { GetColumnDetailsResponse, GetColumnDetailsResponseSchema } from "src/react/redux/types/schemas/dataExplorer";
import { FilePath, Timestamp } from "src/react/redux/types/ui/dataExplorer";

export const getColumnDetailsBuilder = (builder: AIEndpointBuilder<"appDataApi">) => ({
  getColumnDetails: builder.query<GetColumnDetailsResponse, FilePath & Timestamp>({
    query: ({ filePath, timestamp }) => ({
      url: `DataExplorer/GetColumnDetails/${encodeURIComponent(filePath)}?timestamp=${timestamp}`,
      responseHandler: async (response) =>
        await responseValidator<GetColumnDetailsResponse, false>({
          response,
          schema: GetColumnDetailsResponseSchema,
          actionLabel: "get column details"
        })
    })
  })
});
