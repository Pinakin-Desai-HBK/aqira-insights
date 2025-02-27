import { WorkspaceItemNameMutation } from "src/insights/redux/types/redux/networkNodes";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { DashboardVisualizationDataUI } from "src/insights/redux/types/ui/dashboardVisualization";
import { NetworkNodeDataUI } from "src/insights/redux/types/ui/networkNodes";

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
