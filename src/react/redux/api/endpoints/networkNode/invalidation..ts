import { InvalidationMap } from "../../../types/redux/invalidation";
import { getWorkspaceAndContentInvalidationDetailsTargets } from "../workspace/invalidation";

export const NetworkNodeApiInvalidationMap: InvalidationMap = {
  createNetworkNode: ({ workspace: { id: workspaceId } }) => {
    return [
      {
        tags: [{ type: "NetworkNodes", id: `${workspaceId}/LIST` }],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      },
      {
        tags: [{ type: "DisplayNodes" }],
        type: "COMBINED",
        combinedTargets: { recipientType: "ALL" }
      }
    ];
  }
};
