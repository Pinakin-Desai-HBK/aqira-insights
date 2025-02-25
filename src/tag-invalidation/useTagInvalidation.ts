import { useCallback } from "react";
import usePubSubManager from "src/pubsub-manager/usePubSubManager";
import { popoutDetails } from "src/popoutDetails";
import { InvalidateTagsMessage } from "src/redux/types/system/pub-sub";

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
