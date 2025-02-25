import { StatusMessageDialogParams } from "../ui/dialogs";

export type UIAppSlice = {
  appName: string;
  statusMessageParams: Omit<StatusMessageDialogParams, "open"> | null;
};
