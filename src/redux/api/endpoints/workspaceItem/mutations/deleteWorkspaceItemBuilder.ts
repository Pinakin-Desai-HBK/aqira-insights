import { responseValidator } from "src/redux/api/utils/responseValidator";
import {
  DashboardVisualizationDataApi,
  DashboardVisualizationDataSchema
} from "src/redux/types/schemas/dashboardVisualizations";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { NetworkNodeDataApi, NetworkNodeDataSchema } from "src/redux/types/schemas/networkNodes";
import { WorkspaceItemIdentifier } from "src/redux/types/redux/networkNodes";

export const deleteWorkspaceItemBuilder = (builder: AppDataApiEndpointBuilder) => ({
  deleteWorkspaceItem: builder.mutation<NetworkNodeDataApi | DashboardVisualizationDataApi, WorkspaceItemIdentifier>({
    query: ({ workspace, workspaceItem }) => ({
      url:
        workspace.type === "Network"
          ? `Network/${workspace.id}/Node/${workspaceItem.id}`
          : `Dashboard/${workspace.id}/Visualization/${workspaceItem.id}`,
      method: "DELETE",
      responseHandler: async (response) => {
        return workspace.type === "Network"
          ? await responseValidator<NetworkNodeDataApi, false>({
              response,
              schema: NetworkNodeDataSchema,
              actionLabel: "delete workspace item"
            })
          : await responseValidator<DashboardVisualizationDataApi, false>({
              response,
              schema: DashboardVisualizationDataSchema,
              actionLabel: "delete workspace item"
            });
      }
    })
  })
});
