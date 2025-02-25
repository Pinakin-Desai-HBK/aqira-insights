import { ReactElement, useMemo } from "react";
import usePubSubManager from "../pubsub-manager/usePubSubManager";
import { WindowMap } from "../redux/types/context";
import { appTitle } from "../consts/consts";
import { PubSubEvents, PubSubType, SubscriberTypes } from "../redux/types/system/pub-sub";
import { popoutDetails } from "src/popoutDetails";

type AppPopoutManager = {
  tabWindows: WindowMap;
  release: (tabId: string, close: boolean) => void;
  openPopout: ({ name, onBlock, tabId }: PopoutWindowProps) => void;
};

declare global {
  interface Window {
    getAppPopoutManager: () => AppPopoutManager | null;
    setAppPopoutManager: (popoutManager: AppPopoutManager) => void;
  }
}

(() => {
  let appPopoutManager: AppPopoutManager | null = null;
  window.getAppPopoutManager = () => appPopoutManager;
  window.setAppPopoutManager = (popoutManager) => (appPopoutManager = popoutManager);
})();

const getPopoutManager = (pubSub: PubSubType<PubSubEvents>): AppPopoutManager => {
  const found = window.getAppPopoutManager();
  if (found !== null) {
    return found;
  }

  const tabWindows: WindowMap = {};

  const unsubscribeCallbacks = [
    pubSub.subscribe("ReleasePopTab", ({ id }) => release(id, true), SubscriberTypes.MAIN, "SYSTEM")
  ];

  // Close all pop out windows when the main window closes
  window.addEventListener("beforeunload", () => {
    unsubscribeCallbacks.forEach((unsubscribeCallback) => unsubscribeCallback());

    if (!tabWindows) {
      return;
    }
    for (const tabId in tabWindows) {
      const tabWindow = tabWindows[tabId];
      if (tabWindow) {
        const { win, winListener } = tabWindow;
        win.removeEventListener("beforeunload", winListener);
        release(tabId, true);
      }
    }
  });

  const release = (tabId: string, close: boolean) => {
    const tabWindow = tabWindows[tabId];
    if (tabWindow) {
      const { checkerInterval, win } = tabWindow;
      clearInterval(checkerInterval);
      delete tabWindows[tabId];
      if (close) win.close();
    }
  };

  const openPopout = ({ name, onBlock, tabId }: PopoutWindowProps) => {
    if (tabWindows[tabId]) {
      return;
    }
    const win = window.open(
      `${window.location.pathname}?id=${tabId}`,
      "_blank",
      "popup,width=640px,height=640px,toolbar=no,scrollbars=no,location=0"
    );
    if (win) {
      const checkerInterval: NodeJS.Timeout = setInterval(() => {
        if (!win || win.closed) {
          release(tabId, false);
          pubSub.publish("ClosePopTab", { id: tabId, targetSubscriberType: SubscriberTypes.MAIN }, null);
        }
      }, 50);
      const winListener = () => {
        release(tabId, false);
        pubSub.publish("ClosePopTab", { id: tabId, targetSubscriberType: SubscriberTypes.MAIN }, null);
      };
      win.addEventListener("beforeunload", winListener);
      tabWindows[tabId] = { win, checkerInterval, winListener };
      win.addEventListener("load", () => {
        win.document.title = `${appTitle} - ${name}`;
      });
    } else {
      if (onBlock) onBlock(null);
      else console.warn("A new window could not be opened - it may have been blocked.");
    }
  };

  const popoutManager: AppPopoutManager = { tabWindows, openPopout, release };
  window.setAppPopoutManager(popoutManager);
  return popoutManager;
};

type PopoutWindowProps = {
  children?: ReactElement;
  name: string;
  onBlock?: (something: unknown) => void;
  copyStyles?: boolean;
  tabId: string;
};

const usePopoutManager = () => {
  const { isPopout } = popoutDetails;
  const pubSub = usePubSubManager();

  const openPopout = useMemo(() => {
    if (isPopout) {
      return undefined;
    }
    const { openPopout } = getPopoutManager(pubSub);
    return openPopout;
  }, [isPopout, pubSub]);

  const closePopout = useMemo(() => {
    if (isPopout) {
      return undefined;
    }
    const closePopout = (id: string) => {
      pubSub.publish("ReleasePopTab", { id, targetSubscriberType: SubscriberTypes.MAIN }, null);
      pubSub.publish("ClosePopTab", { id, targetSubscriberType: SubscriberTypes.MAIN }, null);
    };
    return closePopout;
  }, [isPopout, pubSub]);

  const closeAllPopouts = useMemo(() => {
    if (isPopout) {
      return undefined;
    }
    const closeAllPopouts = (ids: string[]) => {
      ids.forEach((id) => {
        pubSub.publish("ReleasePopTab", { id, targetSubscriberType: SubscriberTypes.MAIN }, null);
        pubSub.publish("ClosePopTab", { id, targetSubscriberType: SubscriberTypes.MAIN }, null);
      });
    };
    return closeAllPopouts;
  }, [isPopout, pubSub]);

  return { closePopout, openPopout, closeAllPopouts };
};

export default usePopoutManager;
