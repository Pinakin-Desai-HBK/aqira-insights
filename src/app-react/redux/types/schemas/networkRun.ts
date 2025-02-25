import { z } from "zod";

export const NetworkRunStatusValuesSchema = z.enum([
  "NotStarted",
  "Running",
  "Completed",
  "Failed",
  "Aborted",
  "Unknown"
]);
export type NetworkRunStatusValues = z.infer<typeof NetworkRunStatusValuesSchema>;

export const NetworkRunDetailsSchema = z.object({
  runId: z.string().or(z.null()),
  networkId: z.string(),
  networkName: z.string(),
  status: NetworkRunStatusValuesSchema,
  failureMsg: z.string()
});
export type NetworkRunDetails = z.infer<typeof NetworkRunDetailsSchema>;

export const NetworkRunListSchema = z.array(NetworkRunDetailsSchema);
export type NetworkRunList = z.infer<typeof NetworkRunListSchema>;

export const SignalRRunStateChangeEventSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  failureMsg: z.string(),
  networkId: z.string(),
  runId: z.string().or(z.null()),
  state: NetworkRunStatusValuesSchema,
  timestamp: z.string()
});
export type SignalRRunStateChangeEvent = z.infer<typeof SignalRRunStateChangeEventSchema>;
