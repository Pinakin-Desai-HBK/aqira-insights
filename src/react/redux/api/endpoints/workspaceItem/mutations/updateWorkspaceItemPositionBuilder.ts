import { WorkspaceItemPositionMutation } from "src/react/redux/types/redux/networkNodes";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";

export const updateWorkspaceItemPositionBuilder = (builder: AppDataApiEndpointBuilder) => ({
  updateWorkspaceItemPosition: builder.mutation<void, WorkspaceItemPositionMutation>({
    query: ({ workspaceItem, workspace, newPosition }) => ({
      url:
        workspace.type === "Network"
          ? `Network/${workspace.id}/Node/${workspaceItem.id}/Position`
          : `Dashboard/${workspace.id}/Visualization/${workspaceItem.id}/Position`,
      method: "PUT",
      body: { newPosition }
    })
  })
});
