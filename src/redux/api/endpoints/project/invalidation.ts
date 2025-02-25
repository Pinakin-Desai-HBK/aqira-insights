import { InvalidationMap } from "../../../types/redux/invalidation";

export const ProjectApiInvalidationMap: InvalidationMap = {
  loadProject: () => [
    {
      tags: [{ type: "ALL" }],
      type: "INDIVIDUAL",
      sourceMainTargets: { recipientType: "MAIN" }
    }
  ],
  saveProject: undefined,
  newProject: () => [
    {
      tags: [{ type: "ALL" }],
      type: "INDIVIDUAL",
      sourceMainTargets: { recipientType: "MAIN" }
    }
  ]
};
