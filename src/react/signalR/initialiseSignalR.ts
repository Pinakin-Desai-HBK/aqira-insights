import { AppSignalR } from "src/react/redux/types/system/signalR";
import * as signalR from "@microsoft/signalr";
import { getSignalRUrl } from "src/react/helpers/get-url/get-url";
import { SubscriberTypes } from "src/react/redux/types/system/pub-sub";

export const initialiseSignalR = () => {
  const appSignalR: AppSignalR = {
    connection: new signalR.HubConnectionBuilder()
      .withUrl(getSignalRUrl(), { withCredentials: false, transport: signalR.HttpTransportType.WebSockets })
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .withKeepAliveInterval(10000)
      .build(),
    connected: false,
    windowClosing: false,
    datasetSubscriptions: [],
    tabSubscriptions: [],
    resetAPIHandlers: {},
    addResetAPIHandler: (key, handler) => {
      if (!handler) return;
      appSignalR.resetAPIHandlers[key || SubscriberTypes.MAIN] = handler;
    },
    subscribeTabs: async (revisedSubscriptions: string[]) => {
      const oldSubscriptions = appSignalR.tabSubscriptions;
      appSignalR.tabSubscriptions = revisedSubscriptions;
      if (JSON.stringify(revisedSubscriptions.sort()) === JSON.stringify(oldSubscriptions.sort())) return;
      const removedTabs = oldSubscriptions.filter((x) => !revisedSubscriptions.includes(x));
      if (removedTabs.length > 0) {
        console.log(`SignalR - unsubscribing for tabs: ${removedTabs.join(", ")}`);
        await Promise.all(
          removedTabs.map(
            async (groupId) =>
              await appSignalR.connection
                .invoke("UnsubscribeGroup", groupId)
                .catch((err) => console.error(err.toString()))
          )
        );
      }
      const addedTabs = revisedSubscriptions.filter((x) => !oldSubscriptions.includes(x));
      if (addedTabs.length > 0) {
        console.log(`SignalR - subscribing for tabs: ${addedTabs.join(", ")}`);
        await Promise.all(
          addedTabs.map(
            async (groupId) =>
              await appSignalR.connection
                .invoke("SubscribeGroup", groupId)
                .catch((err) => console.error(err.toString()))
          )
        );
      }
    }
  };
  return appSignalR;
};
