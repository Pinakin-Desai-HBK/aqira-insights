import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { CreateWorkspace, Workspace, WorkspaceSchema } from "src/react/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";

export const createWorkspaceBuilder = (builder: AppDataApiEndpointBuilder) => ({
  createWorkspace: builder.mutation<Workspace, { workspace: CreateWorkspace }>({
    query: ({ workspace }) => ({
      url: workspace.type,
      method: "POST",
      body: {},
      responseHandler: async (response) =>
        await responseValidator<Workspace, false>({
          response,
          schema: WorkspaceSchema,
          actionLabel: "post project item"
        })
    })
  })
});
