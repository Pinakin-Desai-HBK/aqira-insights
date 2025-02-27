import { InvalidationMap } from "../../../types/redux/invalidation";
import { getWorkspaceAndContentInvalidationDetailsTargets } from "../workspace/invalidation";

export const NetworkConnectionApiInvalidationMap: InvalidationMap = {
  createNetworkConnection: ({ workspace: { id: workspaceId }, edgeDetails: { sourceNode, destinationNode } }) => {
    return [
      {
        tags: [
          { type: "NetworkEdges", id: `${workspaceId}/LIST` },
          { type: "NetworkEdges", id: `${workspaceId}/${sourceNode}-${destinationNode}` },
          { type: "NetworkEdges", id: `${workspaceId}/${sourceNode}-ANY` },
          { type: "NetworkEdges", id: `${workspaceId}/ANY-${destinationNode}` }
        ],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      }
    ];
  },
  deleteNetworkConnection: ({ workspace: { id: workspaceId }, edgeDetails: { sourceNode, destinationNode } }) => {
    return [
      {
        tags: [
          { type: "NetworkEdges", id: `${workspaceId}/LIST` },
          { type: "NetworkEdges", id: `${workspaceId}/${sourceNode}-${destinationNode}` },
          { type: "NetworkEdges", id: `${workspaceId}/${sourceNode}-ANY` },
          { type: "NetworkEdges", id: `${workspaceId}/ANY-${destinationNode}` }
        ],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      }
    ];
  }
};
