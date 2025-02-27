import { useCallback } from "react";
import usePubSubManager from "src/insights/pubsub-manager/usePubSubManager";
import { popoutDetails } from "src/insights/popoutDetails";
import { InvalidateTagsMessage } from "src/insights/redux/types/system/pub-sub";

export const useTagInvalidation = () => {
  const pubSub = usePubSubManager();
  const invalidateTags = useCallback(
    (message: InvalidateTagsMessage) => {
      pubSub.publish("InvalidateTags", { ...message, targetSubscriberType: "ANY" }, popoutDetails.popoutId);
    },
    [pubSub]
  );
  return { invalidateTags };
};
