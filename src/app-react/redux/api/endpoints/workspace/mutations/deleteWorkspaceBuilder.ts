import { responseValidator } from "src/redux/api/utils/responseValidator";
import { Workspace, WorkspaceSchema } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const deleteWorkspaceBuilder = (builder: AppDataApiEndpointBuilder) => ({
  deleteWorkspace: builder.mutation<Workspace, { id: string }>({
    query: ({ id }) => ({
      url: `Project/Item/${id}`,
      method: "DELETE",
      responseHandler: async (response) =>
        await responseValidator<Workspace, false>({
          response,
          schema: WorkspaceSchema,
          actionLabel: "delete project item"
        })
    })
  })
});
