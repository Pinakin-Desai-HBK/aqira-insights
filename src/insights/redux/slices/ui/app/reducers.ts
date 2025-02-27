import { PayloadAction } from "@reduxjs/toolkit";
import { UIAppSlice } from "src/insights/redux/types/redux/app";
import { StatusMessageDialogParams } from "src/insights/redux/types/ui/dialogs";

export const reducers = {
  uiApp_setStatusMessage: (
    state: UIAppSlice,
    action: PayloadAction<{ statusMessageParams: Omit<StatusMessageDialogParams, "open"> | null }>
  ) => {
    const { statusMessageParams } = action.payload;
    state.statusMessageParams = statusMessageParams ? JSON.parse(JSON.stringify(statusMessageParams)) : null;
  }
};
