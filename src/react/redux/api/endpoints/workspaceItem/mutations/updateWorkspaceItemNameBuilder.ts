import { WorkspaceItemNameMutation } from "src/react/redux/types/redux/networkNodes";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";
import { DashboardVisualizationDataUI } from "src/react/redux/types/ui/dashboardVisualization";
import { NetworkNodeDataUI } from "src/react/redux/types/ui/networkNodes";

export const updateWorkspaceItemNameBuilder = (builder: AppDataApiEndpointBuilder) => ({
  updateWorkspaceItemName: builder.mutation<
    DashboardVisualizationDataUI | NetworkNodeDataUI,
    WorkspaceItemNameMutation
  >({
    query: ({ workspace, workspaceItem, newName }) => ({
      url:
        workspace.type === "Network"
          ? `Network/${workspace.id}/Node/${workspaceItem.id}/Name`
          : `Dashboard/${workspace.id}/Visualization/${workspaceItem.id}/Name`,
      method: "PUT",
      body: { newName }
    })
  })
});
