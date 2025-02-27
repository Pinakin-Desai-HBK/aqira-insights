import { PubSubEvents, PubSubType } from "../redux/types/system/pub-sub";
import { AppSignalR, AppSignalRStore, GetAppSignalRStore, SetAppSignalRStore } from "../redux/types/system/signalR";
import { popoutDetails } from "src/react/popoutDetails";
import { prepareAppSignalR } from "./prepareAppSignalR";

/**
 * Prevent tab sleep
 * https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-8.0&tabs=visual-studio#bsleep
 */
export let lockResolver: null | ((value: unknown) => void) = null;

if (navigator && navigator.locks && navigator.locks.request) {
  const promise = new Promise((res) => {
    lockResolver = res;
  });
  navigator.locks.request("prevent-tab-sleep-lock", { mode: "shared" }, () => {
    return promise;
  });
}

declare global {
  interface Window {
    getAppSignalRStore: GetAppSignalRStore;
    setAppSignalRStore: SetAppSignalRStore;
  }
}

(() => {
  let appSignalRStore: AppSignalRStore = { appSignalR: null, requested: false };

  window.getAppSignalRStore = () => appSignalRStore;
  window.setAppSignalRStore = (signalRStore) => (appSignalRStore = signalRStore);
})();

export const getAppSignalR = async (
  pubSub: PubSubType<PubSubEvents>,
  resetAPIHandler?: () => void
): Promise<AppSignalR | null> => {
  if (window.getAppSignalRStore().appSignalR === null && popoutDetails.isPopout) {
    window.setAppSignalRStore(window.opener.getAppSignalRStore());
  }
  const appSignalRStore = window.getAppSignalRStore();
  if (appSignalRStore.appSignalR !== null) {
    appSignalRStore.appSignalR.addResetAPIHandler(popoutDetails.popoutId, resetAPIHandler);
    return appSignalRStore.appSignalR;
  }
  if (appSignalRStore.requested) return null;
  appSignalRStore.requested = true;
  if (popoutDetails.isPopout) throw Error("AppSignalR - should only be created in the main window");
  const appSignalR = await prepareAppSignalR(pubSub);
  window.setAppSignalRStore({ appSignalR, requested: true });
  appSignalR.addResetAPIHandler(popoutDetails.popoutId, resetAPIHandler);
  return appSignalR;
};
