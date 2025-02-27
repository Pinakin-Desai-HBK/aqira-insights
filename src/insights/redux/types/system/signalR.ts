import { z } from "zod";
import { NetworkRunStatusValues, SignalRRunStateChangeEvent } from "../schemas/networkRun";
import { ServerToClientEvents, ServerToClientGroupEvents } from "./pub-sub";
import { LogMessageSchema } from "../schemas/logMessage";
import { ProjectCreatedEventSchema } from "../schemas/project";
import { SignalRRunHiddenNetworkStateChangeEvent } from "../schemas/hiddenNetworkRun";

// Define group 'functions', and 'parameters', that the server can call
export type ServerToClientGroupFunctions = {
  RunStateChangeEvent: SignalRRunStateChangeEvent;
  DataSetUpdatedEvent: SignalRDataSetUpdatedEvent;
};

export type ServerToClientGroupMappings<
  K extends keyof ServerToClientGroupFunctions,
  KK extends keyof ServerToClientGroupEvents
> = {
  [key in K]: KK;
};

export type ServerToClientGroupMapping<M> =
  M extends ServerToClientGroupMappings<infer K, infer KK>
    ? {
        eventKey: keyof Pick<ServerToClientGroupFunctions, K>;
        messageKey: KK;
        keyAttribute: keyof ServerToClientGroupEvents[KK]["message"];
      }
    : never;

export type S2CGFunctionsSchemaType<F extends keyof ServerToClientGroupFunctions> = z.ZodType<
  ServerToClientGroupFunctions[F],
  z.ZodTypeDef,
  ServerToClientGroupFunctions[F]
>;

// Define 'functions', and 'parameters', that the server can call
export type ServerToClientFunctions = {
  LogMessageEvent: SignalRLogMessageEvent;
  ProjectCreatedEvent: SignalrProjectCreatedEvent;
  ProjectLoadedEvent: SignalrProjectLoadedEvent;
  DataSetAvailableEvent: SignalRDataSetAvailableEvent;
  DSMessageEvent: SignalRDSMessageEvent;
  RunHiddenNetworkStateChangeEvent: SignalRRunHiddenNetworkStateChangeEvent;
};

export type ServerToClientMappings<K extends keyof ServerToClientFunctions, KK extends keyof ServerToClientEvents> = {
  [key in K]: KK;
};

export type ServerToClientMapping<M> =
  M extends ServerToClientMappings<infer K, infer KK>
    ? {
        eventKey: keyof Pick<ServerToClientFunctions, K>;
        messageKey: KK;
      }
    : never;

export type S2CFunctionsSchemaType<F extends keyof ServerToClientFunctions> = z.ZodType<
  ServerToClientFunctions[F],
  z.ZodTypeDef,
  ServerToClientFunctions[F]
>;

type NetworkRunStatus = { workspaceId: string; runId: string | null; status: NetworkRunStatusValues };

export type ClientGroupToServerFunctions = {
  getNetworkRunStatus: {
    params: { id: string; runId: string | null };
    response: { status: NetworkRunStatus };
  };
};

export type AppSignalR = {
  connection: signalR.HubConnection;
  windowClosing: boolean;
  tabSubscriptions: string[];
  datasetSubscriptions: string[];
  subscribeTabs: (revisedSubscriptions: string[]) => Promise<void>;
  resetAPIHandlers: Record<string, () => void>;
  addResetAPIHandler: (key: null | string, handler: undefined | (() => void)) => void;
  connected: boolean;
};

export type AppSignalRStore = {
  appSignalR: AppSignalR | null;
  requested: boolean;
};

export type GetAppSignalRStore = () => AppSignalRStore;

export type SetAppSignalRStore = (appSignalRStore: AppSignalRStore) => void;

export const SignalRLogMessageEventSchema = LogMessageSchema.and(
  z.object({
    logMessageTimestamp: z.string()
  })
);
type SignalRLogMessageEvent = z.infer<typeof SignalRLogMessageEventSchema>;

export const SignalrProjectCreatedEventSchema = ProjectCreatedEventSchema.and(
  z.object({
    timestamp: z.string()
  })
);
type SignalrProjectCreatedEvent = z.infer<typeof SignalrProjectCreatedEventSchema>;

const ProjectLoadedEventSchema = z.object({
  projectId: z.string(),
  timestamp: z.string()
});

export const SignalrProjectLoadedEventSchema = ProjectLoadedEventSchema.and(
  z.object({
    timestamp: z.string()
  })
);
type SignalrProjectLoadedEvent = z.infer<typeof SignalrProjectLoadedEventSchema>;

export const SignalRDataSetUpdatedEventSchema = z.object({
  dataSetId: z.string(),
  timestamp: z.string()
});
export type SignalRDataSetUpdatedEvent = z.infer<typeof SignalRDataSetUpdatedEventSchema>;

export const SignalRDataSetAvailableEventSchema = z.object({
  timestamp: z.string()
});
type SignalRDataSetAvailableEvent = z.infer<typeof SignalRDataSetAvailableEventSchema>;

export const SignalRDSMessageEventSchema = z.object({
  eventId: z.string(),
  id: z.string(),
  level: z.string(),
  message: z.string(),
  networkId: z.string(),
  networkName: z.string(),
  timestamp: z.string()
});

type SignalRDSMessageEvent = z.infer<typeof SignalRDSMessageEventSchema>;
