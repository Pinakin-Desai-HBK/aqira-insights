import { responseValidator } from "src/redux/api/utils/responseValidator";
import { ExportAsPythonPayload } from "src/redux/types/payload";
import { EmptyObject, EmptyObjectSchema } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const exportAsPythonBuilder = (builder: AppDataApiEndpointBuilder) => ({
  exportAsPython: builder.mutation<Record<string, never>, ExportAsPythonPayload>({
    query: ({ exportPath, networkId, overwrite }) => ({
      url: `Network/${networkId}/Export`,
      method: "POST",
      body: { exportPath, overwrite },
      responseHandler: async (response) =>
        await responseValidator<EmptyObject, false>({
          response,
          schema: EmptyObjectSchema,
          actionLabel: "post project item"
        })
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformResponse: (response: any) => {
      if (response && "type" in response && ["zod_error", "api_error", "syntax_error"].indexOf(response.type) > -1) {
        throw response;
      }
      return response;
    },
    transformErrorResponse: (error) => {
      return error.data;
    }
  })
});
