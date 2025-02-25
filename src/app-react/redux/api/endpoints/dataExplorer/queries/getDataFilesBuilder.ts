import { responseValidator } from "src/redux/api/utils/responseValidator";
import { DataFilesSchema } from "src/redux/types/schemas/dataExplorer";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { DataFileItem, DataFiles, Folder, Timestamp } from "src/redux/types/ui/dataExplorer";

export const getDataFilesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getDataFiles: builder.query<DataFileItem[], Folder & Timestamp>({
    query: ({ folder, timestamp }) => ({
      url: `DataExplorer/GetFiles/${encodeURIComponent(folder)}?timestamp=${timestamp}`,
      responseHandler: async (response) =>
        await responseValidator<DataFiles, false>({
          response,
          schema: DataFilesSchema,
          actionLabel: "get data files"
        })
    }),
    transformResponse: (response: DataFiles) => response.files.map((item) => ({ type: "DataFile", item })),
    transformErrorResponse: (error) => {
      return error.data;
    },
    providesTags: (_result, _error, arg) => [{ type: "DataFiles", id: `${arg.folder}` }]
  })
});
