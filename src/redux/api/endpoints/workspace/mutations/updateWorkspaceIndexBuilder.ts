import { Workspace } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const updateWorkspaceIndexBuilder = (builder: AppDataApiEndpointBuilder) => ({
  updateWorkspaceIndex: builder.mutation<Workspace, { id: string; newIndex: number }>({
    query: ({ id, newIndex }) => ({
      url: `Project/Item/${id}/Index`,
      method: "PUT",
      body: { newIndex }
    })
  })
});
