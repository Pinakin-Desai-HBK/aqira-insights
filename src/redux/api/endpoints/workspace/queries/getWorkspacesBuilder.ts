import { providesTagsList } from "src/redux/api/utils/providesTagsList";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { WorkspaceArray, WorkspaceArraySchema } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const getWorkspacesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getWorkspaces: builder.query<WorkspaceArray, void>({
    query: () => ({
      url: `Project/Item`,
      responseHandler: async (response) =>
        await responseValidator<WorkspaceArray, false>({
          response,
          schema: WorkspaceArraySchema,
          actionLabel: "get project items"
        })
    }),
    providesTags: (result) => providesTagsList(result, "Workspaces")
  })
});
