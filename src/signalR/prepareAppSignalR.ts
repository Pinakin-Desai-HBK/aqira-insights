import { PubSubEvents, PubSubType } from "src/redux/types/system/pub-sub";
import { handleNewSignalRConnection } from "./handleNewSignalRConnection";
import { initialiseSignalR } from "./initialiseSignalR";
import { AppSignalR } from "src/redux/types/system/signalR";

export const prepareAppSignalR = async (pubSub: PubSubType<PubSubEvents>): Promise<AppSignalR> => {
  const appSignalR: AppSignalR = initialiseSignalR();
  const startConnection = async (initialising?: boolean) => {
    try {
      if (appSignalR.windowClosing) {
        return;
      }
      await appSignalR.connection.start();
      await handleNewSignalRConnection(appSignalR, pubSub, initialising);
      console.log("SignalR - started", appSignalR.connection.connectionId);
      initialising = false;
    } catch (error: unknown) {
      console.log(`SignalR - error starting: ${error || "Unknown error"}`);
      console.log("SignalR - restarting");
      setTimeout(startConnection, 1000);
    }
  };
  appSignalR.connection.onclose((error?: Error) => {
    appSignalR.connected = false;
    console.log(`SignalR - connection closed: ${error || "Unknown error"}`);
    console.log("SignalR - restarting");
    setTimeout(startConnection, 1000);
  });
  appSignalR.connection.onreconnected(async (connectionId?: string) => {
    console.log("SignalR - reconnected", connectionId);
    await handleNewSignalRConnection(appSignalR, pubSub);
  });
  window.addEventListener("beforeunload", async () => {
    appSignalR.windowClosing = true;
    try {
      await appSignalR.connection.stop();
      appSignalR.connected = false;
      console.log("SignalR - stopped");
    } catch (error: unknown) {
      console.log(`SignalR - error stopping: ${error || "Unknown error"}`);
    }
  });
  await startConnection();
  return appSignalR;
};
