import { z } from "zod";
import { NetworkRunStatusValuesSchema } from "./networkRun";

export const SignalRRunHiddenNetworkStateChangeEventSchema = z.object({
  id: z.string().uuid(),
  visualizationName: z.string(),
  dashboardName: z.string(),
  runId: z.string().uuid().nullable(),
  state: NetworkRunStatusValuesSchema,
  failureMsg: z.string(),
  timestamp: z.string().datetime()
});
export type SignalRRunHiddenNetworkStateChangeEvent = z.infer<typeof SignalRRunHiddenNetworkStateChangeEventSchema>;
