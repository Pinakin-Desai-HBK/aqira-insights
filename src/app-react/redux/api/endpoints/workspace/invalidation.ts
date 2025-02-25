import { invalidatesTagsList } from "../../utils/providesTagsList";
import { InvalidationDetailsTargets, InvalidationMap } from "../../../types/redux/invalidation";

export const getWorkspaceAndContentInvalidationDetailsTargets = (workspaceId: string): InvalidationDetailsTargets => {
  return {
    type: "INDIVIDUAL",
    sourceMainTargets: { recipientType: "TARGETTED", include: ["MAIN", workspaceId] },
    sourcePopupTargets: { recipientType: "TARGETTED", include: ["MAIN", workspaceId] }
  };
};

export const WorkspaceApiInvalidationMap: InvalidationMap = {
  createWorkspace: () => [
    {
      tags: [{ type: "Workspaces", id: "LIST" }],
      type: "INDIVIDUAL",
      sourceMainTargets: { recipientType: "MAIN" }
    }
  ],
  updateWorkspaceName: ({ id }) => [
    {
      tags: invalidatesTagsList({ id }, "Workspaces"),
      ...getWorkspaceAndContentInvalidationDetailsTargets(id)
    },
    {
      tags: [{ type: "DisplayNodes" }],
      type: "COMBINED",
      combinedTargets: { recipientType: "ALL" }
    }
  ],
  updateWorkspaceIndex: ({ id }) => [
    {
      tags: invalidatesTagsList({ id }, "Workspaces"),
      type: "INDIVIDUAL",
      sourceMainTargets: { recipientType: "MAIN" }
    }
  ],
  deleteWorkspace: ({ id }) => [
    {
      tags: invalidatesTagsList({ id }, "Workspaces"),
      type: "INDIVIDUAL",
      sourceMainTargets: { recipientType: "MAIN" }
    },
    {
      tags: [{ type: "DisplayNodes" }],
      type: "COMBINED",
      combinedTargets: { recipientType: "ALL" }
    }
  ]
};
