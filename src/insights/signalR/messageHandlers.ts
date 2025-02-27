import {
  PubSubEvents,
  PubSubType,
  ServerToClientEvents,
  ServerToClientGroupEvents,
  SubscriberTypes
} from "src/insights/redux/types/system/pub-sub";
import {
  AppSignalR,
  ClientGroupToServerFunctions,
  S2CFunctionsSchemaType,
  S2CGFunctionsSchemaType,
  ServerToClientFunctions,
  ServerToClientGroupFunctions,
  ServerToClientGroupMapping,
  ServerToClientGroupMappings,
  ServerToClientMapping,
  ServerToClientMappings
} from "src/insights/redux/types/system/signalR";

export const addServerToClientGroupFunctionHandler = <
  K extends keyof ServerToClientGroupFunctions,
  KK extends keyof ServerToClientGroupEvents
>(
  mapping: ServerToClientGroupMapping<ServerToClientGroupMappings<K, KK>>,
  schema: S2CGFunctionsSchemaType<K>,
  appSignalR: AppSignalR,
  pubSub: PubSubType<PubSubEvents>
) => {
  console.log(`SignalR - registering group message handler - `, mapping.eventKey);
  appSignalR.connection.off(mapping.eventKey);
  appSignalR.connection.on(mapping.eventKey, (data: unknown) => {
    try {
      const message = { message: schema.parse(data) } as PubSubEvents[typeof mapping.messageKey];
      const keyAttributeValue: string = message.message[mapping.keyAttribute];
      const pubSubKey: keyof PubSubEvents = `${mapping.messageKey}${keyAttributeValue}`;
      //console.log("SignalR - publishing group message to PubSub with key", pubSubKey, message);
      pubSub.publish(pubSubKey, { ...message, targetSubscriberType: "ANY" }, null);
    } catch (e) {
      console.log(e);
    }
  });
};

export const addServerToClientFunctionHandler = <
  K extends keyof ServerToClientFunctions,
  KK extends keyof ServerToClientEvents
>(
  mapping: ServerToClientMapping<ServerToClientMappings<K, KK>>,
  schema: S2CFunctionsSchemaType<K>,
  appSignalR: AppSignalR,
  pubSub: PubSubType<PubSubEvents>
) => {
  console.log(`SignalR - registering global message handler - `, mapping.eventKey);
  appSignalR.connection.off(mapping.eventKey);
  appSignalR.connection.on(mapping.eventKey, (data) => {
    try {
      const message = { message: schema.parse(data) } as PubSubEvents[typeof mapping.messageKey];
      const pubSubKey: keyof PubSubEvents = mapping.messageKey;
      //console.log("SignalR - publishing global message to PubSub with key", pubSubKey, message);
      pubSub.publish(mapping.messageKey, { ...message, targetSubscriberType: "ANY" }, null);
    } catch (e) {
      console.log(e);
    }
  });
};

export const subscribeForNetworkSendEvents = (appSignalR: AppSignalR, pubSub: PubSubType<PubSubEvents>) => {
  pubSub.subscribe(
    `SignalRSend`,
    ({ methodName, tabId, args }) => {
      appSignalR.connection
        .invoke(methodName, tabId, args)
        .then((result: ClientGroupToServerFunctions[keyof ClientGroupToServerFunctions]["response"]) => {
          if (methodName === "getNetworkRunStatus" && "networkId" in result)
            pubSub.publish(
              `C2SG-getNetworkRunStatus-${result.networkId}`,
              { message: result, targetSubscriberType: "ANY" },
              null
            );
        })
        .catch(function (err) {
          console.error(err.toString());
        });
    },
    SubscriberTypes.MAIN,
    null
  );
};
