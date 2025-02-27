import { PayloadAction } from "@reduxjs/toolkit";
import { LogMessage } from "src/insights/redux/types/schemas/logMessage";
import { UILogPanelSlice } from "src/insights/redux/types/redux/logMessage";
import { checkMessages } from "./support/utils";

export const reducers = {
  uiLogPanel_addLogMessage: (state: UILogPanelSlice, action: PayloadAction<{ logMessage: LogMessage }>) => {
    state.logMessages = checkMessages([action.payload.logMessage, ...state.logMessages]);
  },
  uiLogPanel_toggle: (state: UILogPanelSlice) => {
    state.showLogPanel = !state.showLogPanel;
  }
};
