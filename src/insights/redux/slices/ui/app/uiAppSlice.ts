import { createSlice } from "@reduxjs/toolkit";
import { UIAppSlice } from "../../../types/redux/app";
import { RootState } from "src/insights/redux/store";
import { reducers } from "./reducers";

const initialState: UIAppSlice = {
  appName: "Advantage Insights",
  statusMessageParams: null
};

export const uiApp = createSlice({
  name: "uiApp",
  initialState,
  reducers
});

export const { uiApp_setStatusMessage } = uiApp.actions;

export const selectStore_UI_App_StatusMessageParams = (state: RootState) => state.ui.app.statusMessageParams;
