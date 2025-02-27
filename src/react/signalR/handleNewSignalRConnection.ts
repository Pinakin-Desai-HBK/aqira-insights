import { SignalRRunStateChangeEventSchema } from "src/react/redux/types/schemas/networkRun";
import { PubSubEvents, PubSubType } from "src/react/redux/types/system/pub-sub";
import { SignalRRunHiddenNetworkStateChangeEventSchema } from "src/react/redux/types/schemas/hiddenNetworkRun";
import {
  AppSignalR,
  SignalRDataSetAvailableEventSchema,
  SignalRDataSetUpdatedEventSchema,
  SignalRDSMessageEventSchema,
  SignalRLogMessageEventSchema
} from "src/react/redux/types/system/signalR";
import {
  addServerToClientFunctionHandler,
  addServerToClientGroupFunctionHandler,
  subscribeForNetworkSendEvents
} from "./messageHandlers";

export const handleNewSignalRConnection = async (
  appSignalR: AppSignalR,
  pubSub: PubSubType<PubSubEvents>,
  initialising?: boolean
) => {
  appSignalR.connected = true;
  appSignalR.tabSubscriptions = [];
  addServerToClientGroupFunctionHandler<"RunStateChangeEvent", "S2CG-RunStateChangeEvent-">(
    {
      eventKey: "RunStateChangeEvent",
      messageKey: "S2CG-RunStateChangeEvent-",
      keyAttribute: "networkId"
    },
    SignalRRunStateChangeEventSchema,
    appSignalR,
    pubSub
  );
  addServerToClientGroupFunctionHandler<"DataSetUpdatedEvent", "S2CG-DataSetUpdatedEvent-">(
    {
      eventKey: "DataSetUpdatedEvent",
      messageKey: "S2CG-DataSetUpdatedEvent-",
      keyAttribute: "dataSetId"
    },
    SignalRDataSetUpdatedEventSchema,
    appSignalR,
    pubSub
  );
  addServerToClientFunctionHandler(
    {
      eventKey: "LogMessageEvent",
      messageKey: "S2C-LogMessageEvent"
    },
    SignalRLogMessageEventSchema,
    appSignalR,
    pubSub
  );
  addServerToClientFunctionHandler(
    {
      eventKey: "DataSetAvailableEvent",
      messageKey: "S2C-DataSetAvailableEvent"
    },
    SignalRDataSetAvailableEventSchema,
    appSignalR,
    pubSub
  );
  addServerToClientFunctionHandler(
    {
      eventKey: "DSMessageEvent",
      messageKey: "S2C-DSMessageEvent"
    },
    SignalRDSMessageEventSchema,
    appSignalR,
    pubSub
  );
  addServerToClientFunctionHandler(
    {
      eventKey: "RunHiddenNetworkStateChangeEvent",
      messageKey: "S2C-RunHiddenNetworkStateChangeEvent"
    },
    SignalRRunHiddenNetworkStateChangeEventSchema,
    appSignalR,
    pubSub
  );

  subscribeForNetworkSendEvents(appSignalR, pubSub);
  if (!initialising) {
    Object.keys(appSignalR.resetAPIHandlers).forEach((key: string) => {
      const handler = appSignalR.resetAPIHandlers[key as keyof typeof appSignalR.resetAPIHandlers];
      if (handler) {
        handler();
      }
    });
    console.log("SignalR - API reset for new connection");
  }
};
