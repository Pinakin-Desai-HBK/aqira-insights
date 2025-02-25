import { getWorkspaceAndContentInvalidationDetailsTargets } from "../workspace/invalidation";
import { InvalidationMap } from "../../../types/redux/invalidation";

export const DashboardVisualizationInvalidationMap: InvalidationMap = {
  createDashboardVisualization: ({ workspace: { id: workspaceId } }) => {
    return [
      {
        tags: [{ type: "DashboardVisualizations", id: `${workspaceId}/LIST` }],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      }
    ];
  }
};
