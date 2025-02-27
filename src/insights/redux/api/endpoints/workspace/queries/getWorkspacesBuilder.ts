import { providesTagsList } from "src/insights/redux/api/utils/providesTagsList";
import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { WorkspaceArray, WorkspaceArraySchema } from "src/insights/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";

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
