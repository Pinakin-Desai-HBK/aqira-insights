import { Action, isFulfilled, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { getPubSubStore } from "src/react/pubsub-manager/usePubSubManager";
import { Tags } from "../../types/redux/redux";
import { popoutDetails } from "src/react/popoutDetails";

export const invalidateProjectDataMiddleware: Middleware = () => (next) => (unknownAction) => {
  const action = unknownAction as Action | PayloadAction<Tags>;
  if (isFulfilled(action)) {
    const arg = typeof action.meta.arg === "object" && action.meta.arg !== null && action.meta.arg;
    const isMutation = arg && "type" in arg && arg.type === "mutation";
    if (isMutation) {
      const { pubSub } = getPubSubStore(popoutDetails.isPopout);
      pubSub.publish(
        "InvalidateTags",
        {
          sourcePopoutId: popoutDetails.popoutId,
          tags: [{ type: "Project" }],
          recipientType: "ALL",
          targetSubscriberType: "ANY"
        },
        popoutDetails.popoutId
      );
    }
  }
  return next(action);
};
