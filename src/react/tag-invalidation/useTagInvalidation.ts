import { useCallback } from "react";
import usePubSubManager from "src/react/pubsub-manager/usePubSubManager";
import { popoutDetails } from "src/react/popoutDetails";
import { InvalidateTagsMessage } from "src/react/redux/types/system/pub-sub";

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
