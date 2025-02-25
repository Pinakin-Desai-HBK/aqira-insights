import { LogMessageArray } from "../schemas/logMessage";

export type UILogPanelSlice = {
  logMessages: LogMessageArray;
  showLogPanel: boolean;
};
