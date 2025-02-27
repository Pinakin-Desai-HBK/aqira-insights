import { InvalidationMap } from "../../../types/redux/invalidation";

export const NetworkRunApiInvalidationMap: InvalidationMap = {
  startNetworkRun: ({ networkId }) => {
    return [
      {
        tags: [
          { type: "NetworkRun", id: "LIST" },
          { type: "NetworkRun", id: `${networkId}/LIST` }
        ],
        type: "COMBINED",
        combinedTargets: { recipientType: "ALL" }
      }
    ];
  },
  abortNetworkRun: ({ runId }, { networkId }) => {
    return [
      {
        tags: [
          { type: "NetworkRun", id: "LIST" },
          { type: "NetworkRun", id: `${networkId}/LIST` },
          { type: "NetworkRun", id: `${networkId}/${runId}` }
        ],
        type: "COMBINED",
        combinedTargets: { recipientType: "ALL" }
      }
    ];
  }
};
