import { Tags } from "src/react/redux/types/redux/redux";
import { ClientGroupToServerFunctions, ServerToClientGroupFunctions, ServerToClientFunctions } from "./signalR";
import { ClosePopTabMessage, OpenGlobalSpeedDialMessage, ReleasePopTabMessage } from "../ui/messages";
import { TagDescription } from "@reduxjs/toolkit/query";

type SignalRSendMessage<K extends keyof ClientGroupToServerFunctions> = {
  methodName: K;
  tabId: string;
  args: [ClientGroupToServerFunctions[K]["params"]];
};

type SubscriberType = "MAIN" | "POPUP";

export const SubscriberTypes: Record<SubscriberType, SubscriberType> = {
  MAIN: "MAIN",
  POPUP: "POPUP"
};

export type TargetSubscriberType = SubscriberType | "ANY";

type Messages<E> = {
  [K in string & keyof E]: { message: { targetSubscriberType: TargetSubscriberType } & E[K] };
};

type Pub<E> = <K extends string & keyof E>(
  event: K,
  message: Messages<E>[K]["message"],
  popoutId: string | null
) => void;

type SubHandler<E, K extends string & keyof E> = (message: Messages<E>[K]["message"]) => void;

type Sub<E> = <K extends string & keyof E>(
  event: K,
  handler: SubHandler<E, K>,
  subscriberType: SubscriberType,
  popoutId: string | null
) => () => void;

export type PubSubType<E> = {
  publish: Pub<E>;
  subscribe: Sub<E>;
};

export type HandlerStoreEntry<E, K extends string & keyof E> = {
  handler: SubHandler<E, K>;
  subscriberType: SubscriberType;
  id: string;
};
export type HandlerStore<E> = { [K in string & keyof E]?: HandlerStoreEntry<E, K>[] };

export type AppPubSubStore<E> = {
  pubSub: PubSubType<E>;
  handlerStore: HandlerStore<E>;
};

export type GetAppPubSubStore<E> = () => AppPubSubStore<E> | null;

export type SetAppPubSubStore<E> = (appPubSubStore: AppPubSubStore<E>) => void;

type ClientToServerGroupEvents = {
  [k in `C2SG-getNetworkRunStatus-${string}`]: {
    message: ClientGroupToServerFunctions["getNetworkRunStatus"]["response"];
  };
};

export type ServerToClientGroupEvents = {
  [k in `S2CG-RunStateChangeEvent-${string}`]: { message: ServerToClientGroupFunctions["RunStateChangeEvent"] };
} & {
  [k in `S2CG-DataSetUpdatedEvent-${string}`]: {
    message: ServerToClientGroupFunctions["DataSetUpdatedEvent"];
  };
};

export type ServerToClientEvents = {
  [k in `S2C-DataSetAvailableEvent`]: { message: ServerToClientFunctions["DataSetAvailableEvent"] };
} & {
  [k in `S2C-LogMessageEvent`]: { message: ServerToClientFunctions["LogMessageEvent"] };
} & {
  [k in `S2C-DSMessageEvent`]: { message: ServerToClientFunctions["DSMessageEvent"] };
} & {
  [k in `S2C-RunHiddenNetworkStateChangeEvent`]: {
    message: ServerToClientFunctions["RunHiddenNetworkStateChangeEvent"];
  };
};

type AppPubSubEvents = {
  ClosePopTab: ClosePopTabMessage;
  ReleasePopTab: ReleasePopTabMessage;
  SignalRSend: SignalRSendMessage<keyof ClientGroupToServerFunctions>;
  InvalidateTags: InvalidateTagsMessage;
  OpenGlobalSpeedDial: OpenGlobalSpeedDialMessage;
};

export type InvalidateTagsMessage = {
  tags: TagDescription<Tags>[];
  sourcePopoutId: string | null;
} & InvalidateTagsRecipent;

export type InvalidateTagsRecipent =
  | {
      recipientType: "TARGETTED";
      include: string[];
    }
  | { recipientType: "ALL" }
  | { recipientType: "POPUP"; exclude: string[] }
  | { recipientType: "MAIN" };

export type PubSubEvents = AppPubSubEvents &
  ClientToServerGroupEvents &
  ServerToClientEvents &
  ServerToClientGroupEvents;
