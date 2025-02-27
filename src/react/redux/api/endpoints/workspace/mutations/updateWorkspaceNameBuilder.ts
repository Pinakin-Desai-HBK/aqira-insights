import { Workspace } from "src/react/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";

export const updateWorkspaceNameBuilder = (builder: AppDataApiEndpointBuilder) => ({
  updateWorkspaceName: builder.mutation<Workspace, { id: string; newName: string }>({
    query: ({ id, newName }) => ({
      url: `Project/Item/${id}/Name`,
      method: "PUT",
      body: { newName }
    })
  })
});
