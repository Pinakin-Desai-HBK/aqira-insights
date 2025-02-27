import { useEffect } from "react";
import usePubSubManager from "src/react/pubsub-manager/usePubSubManager";
import { popoutDetails } from "src/react/popoutDetails";
import { useAppDispatch } from "src/react/redux/hooks/hooks";
import { uiProject_closePopout } from "src/react/redux/slices/ui/project/projectSlice";
import { SubscriberTypes } from "src/react/redux/types/system/pub-sub";

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
