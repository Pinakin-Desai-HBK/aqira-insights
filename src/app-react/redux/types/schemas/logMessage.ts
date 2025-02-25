import { z } from "zod";

const LogMessageLevelSchema = z.enum(["Information", "Warning", "Error", "Success"]);
export type LogMessageLevel = z.infer<typeof LogMessageLevelSchema>;

export const LogMessageSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  level: LogMessageLevelSchema,
  source: z.string(),
  message: z.string()
});
export type LogMessage = z.infer<typeof LogMessageSchema>;

export const LogMessageArraySchema = z.array(LogMessageSchema);
export type LogMessageArray = z.infer<typeof LogMessageArraySchema>;
