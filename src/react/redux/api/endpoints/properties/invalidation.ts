import { getWorkspaceAndContentInvalidationDetailsTargets } from "../workspace/invalidation";
import { InvalidationMap } from "../../../types/redux/invalidation";
import { Tags } from "src/react/redux/types/redux/redux";
import { TagDescription } from "@reduxjs/toolkit/query";

export const PropertiesApiInvalidationMap: InvalidationMap = {
  updateProperty: ({
    item: {
      workspace: { id: workspaceId },
      workspaceItem: { id }
    },
    propertyName
  }) => {
    const extraTags: TagDescription<Tags>[] | null =
      propertyName === "InputCount" || propertyName === "Type"
        ? [{ type: "NetworkNodes", id: `${workspaceId}/${id}` }]
        : [];
    return [
      {
        tags: [{ type: "Properties", id }, ...extraTags],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      }
    ];
  },
  updatePropertyExpression: ({
    item: {
      workspace: { id: workspaceId },
      workspaceItem: { id }
    }
  }) => {
    return [
      {
        tags: [{ type: "Properties", id }],
        ...getWorkspaceAndContentInvalidationDetailsTargets(workspaceId)
      }
    ];
  }
};
