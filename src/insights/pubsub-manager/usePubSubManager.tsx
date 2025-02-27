import { useState } from "react";
import {
  AppPubSubStore,
  GetAppPubSubStore,
  HandlerStore,
  HandlerStoreEntry,
  PubSubEvents,
  PubSubType,
  SetAppPubSubStore,
  SubscriberTypes
} from "../redux/types/system/pub-sub";
import { popoutDetails } from "src/insights/popoutDetails";

declare global {
  interface Window {
    // Important: Don't call window.getAppPubSubStore() directly unless the code you are calling from is not in React and below AppDataContext
    getAppPubSubStore: GetAppPubSubStore<PubSubEvents>;

    // Important: Never call this outside of this file
    setAppPubSubStore: SetAppPubSubStore<PubSubEvents>;
  }
}

(() => {
  let appPubSubStore: AppPubSubStore<PubSubEvents> | null = null;
  window.getAppPubSubStore = () => appPubSubStore;
  window.setAppPubSubStore = (pubSubStore) => (appPubSubStore = pubSubStore);
})();

export const getPubSubStore = <E extends PubSubEvents>(isPopout: boolean): AppPubSubStore<E> => {
  if (window.getAppPubSubStore() === null && isPopout) {
    window.setAppPubSubStore(window.opener.getAppPubSubStore());
  }
  if (window.getAppPubSubStore() !== null) {
    return window.getAppPubSubStore() as unknown as AppPubSubStore<E>;
  }

  const handlerStore: HandlerStore<E> = {};
  const pubSub: PubSubType<E> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    publish: (event, msg, popoutId) => {
      const entries = handlerStore[event] || [];
      entries.forEach(({ handler, subscriberType }) => {
        if (msg.targetSubscriberType === "ANY" || msg.targetSubscriberType === subscriberType) {
          handler(msg);
        }
      });
    },
    subscribe: (event, handler, subscriberType, popoutId) => {
      handlerStore[event] = [
        ...(handlerStore[event] || []),
        { handler, subscriberType, id: popoutId || SubscriberTypes.MAIN }
      ];

      return () => {
        //handlerStore[event] = (handlerStore[event] || []).filter(
        //  (entry) => entry.id === "SYSTEM" || (popoutId || SubscriberTypes.MAIN) !== entry.id
        //);
        handlerStore[event] = (handlerStore[event] || []).filter(
          (entry) => entry.id === "SYSTEM" || handler !== entry.handler
        );
      };
    }
  };

  pubSub.subscribe(
    "ClosePopTab",
    (msg) => {
      const handlerStore = window.getAppPubSubStore()?.handlerStore;
      if (handlerStore) {
        (Object.keys(handlerStore) as Array<keyof PubSubEvents>).forEach((key) => {
          const handlers = handlerStore[key];
          if (handlers === undefined) return;
          const newHandlers = handlers.filter((entry) => {
            return entry.id === "SYSTEM" || msg.id !== entry.id;
          }) as HandlerStoreEntry<PubSubEvents, typeof key>[];
          handlerStore[key] = newHandlers;
        });
      }
    },
    SubscriberTypes.MAIN,
    "SYSTEM"
  );

  const pubSubStore: AppPubSubStore<E> = { pubSub, handlerStore };
  window.setAppPubSubStore(pubSubStore as unknown as AppPubSubStore<PubSubEvents>);
  return pubSubStore;
};

const usePubSubManager = () => {
  const { isPopout } = popoutDetails;
  const [pubSub] = useState(() => getPubSubStore(isPopout).pubSub);
  return pubSub;
};

export default usePubSubManager;
