import { useEffect } from "react";
import usePubSubManager from "src/insights/pubsub-manager/usePubSubManager";
import { popoutDetails } from "src/insights/popoutDetails";
import { useAppDispatch } from "src/insights/redux/hooks/hooks";
import { uiProject_closePopout } from "src/insights/redux/slices/ui/project/projectSlice";
import { SubscriberTypes } from "src/insights/redux/types/system/pub-sub";

export const useClosePopoutHandler = () => {
  const { isPopout, popoutId } = popoutDetails;
  const pubSub = usePubSubManager();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const subscriberType = isPopout ? SubscriberTypes.POPUP : SubscriberTypes.MAIN;
    const unsubscribeCallbacks = [
      pubSub.subscribe(
        "ClosePopTab",
        (message) => {
          appDispatch(uiProject_closePopout(message.id));
        },
        subscriberType,
        popoutId
      )
    ];
    return () => {
      unsubscribeCallbacks.forEach((unsubscribeCallback) => unsubscribeCallback());
    };
  }, [appDispatch, isPopout, popoutId, pubSub]);

  return null;
};
