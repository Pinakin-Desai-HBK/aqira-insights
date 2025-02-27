import { providesTagsList } from "src/react/redux/api/utils/providesTagsList";
import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { WorkspaceArray, WorkspaceArraySchema } from "src/react/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";

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
