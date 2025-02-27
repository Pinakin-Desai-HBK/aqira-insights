import { TagDescription } from "@reduxjs/toolkit/query";
import { Tags } from "src/insights/redux/types/redux/redux";
import { getWorkspaceAndContentInvalidationDetailsTargets } from "../workspace/invalidation";
import { InvalidationMap } from "../../../types/redux/invalidation";

export const WorkspaceItemApiInvalidationMap: InvalidationMap = {
  deleteWorkspaceItem: ({ workspace: { id: workspaceId, type: workspaceType }, workspaceItem: { id } }) => {
    const tagType: Tags = workspaceType === "Network" ? "NetworkNodes" : "DashboardVisualizations";
    return [
      {
        tags: [
          { type: tagType, id: `${workspaceId}/LIST` },
          { type: tagType, id: `${workspaceId}/${id}` },
          { type: "Properties", id },
          ...((tagType === "NetworkNodes"
            ? [
                { type: "NetworkEdges", id: `${workspaceId}/LIST` },
                { type: "NetworkEdges", id: `${workspaceId}/${id}-ANY` },
                { type: "NetworkEdges", id: `${workspaceId}/ANY-${id}` }
              ]
            : []) as TagDescription<Tags>[])
        ],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      },
      {
        tags: [{ type: "DisplayNodes" }],
        type: "COMBINED",
        combinedTargets: { recipientType: "ALL" }
      }
    ];
  },
  updateWorkspaceItemPosition: ({ workspace: { id: workspaceId, type: workspaceType }, workspaceItem: { id } }) => {
    const tagType: Tags = workspaceType === "Network" ? "NetworkNodes" : "DashboardVisualizations";
    return [
      {
        tags: [{ type: tagType, id: `${workspaceId}/${id}` }],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      }
    ];
  },
  updateWorkspaceItemName: ({ workspace: { id: workspaceId, type: workspaceType }, workspaceItem: { id } }) => {
    const tagType: Tags = workspaceType === "Network" ? "NetworkNodes" : "DashboardVisualizations";
    return [
      {
        tags: [{ type: tagType, id: `${workspaceId}/${id}` }],
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
