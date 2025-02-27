import { ErrorDetails, responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import {
  GetColumnDetailsDataResponse,
  GetColumnDetailsDataResponseSchema
} from "src/insights/redux/types/schemas/dataExplorer";
import { Timestamp } from "src/insights/redux/types/ui/dataExplorer";

export const getColumnDetailsDataBuilder = (builder: AIEndpointBuilder<"appDataApi">) => ({
  getColumnDetailsData: builder.query<ErrorDetails | string, { id: string } & Timestamp>({
    query: ({ id, timestamp }) => ({
      url: `DataExplorer/GetColumnDetailsData/${id}?timestamp=${timestamp}`,
      responseHandler: async (response) => {
        const result = await responseValidator<GetColumnDetailsDataResponse, true>({
          response,
          schema: GetColumnDetailsDataResponseSchema,
          actionLabel: "get column details data",
          returnText: true
        });
        return result;
      }
    })
  })
});
