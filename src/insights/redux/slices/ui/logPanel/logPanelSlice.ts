import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { UILogPanelSlice } from "src/insights/redux/types/redux/logMessage";
import { reducers } from "./reducers";
import { extraReducers } from "./extraReducers";

const getInitialState = (): UILogPanelSlice => ({
  logMessages: [],
  showLogPanel: false
});

export const uiLogPanel = createSlice({
  name: "uiLogPanel",
  initialState: getInitialState(),
  reducers,
  extraReducers
});

export const { uiLogPanel_addLogMessage, uiLogPanel_toggle } = uiLogPanel.actions;

export const selectStore_UI_LogPanel_ShowLogPanel = (state: RootState) => state.ui.logPanel.showLogPanel;
export const selectStore_UI_LogPanel_LogMessages = (state: RootState) => state.ui.logPanel.logMessages;
