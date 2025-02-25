import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { appApi } from "src/redux/api/appApi";
import { UILogPanelSlice } from "src/redux/types/redux/logMessage";
import { checkMessages } from "./support/utils";

export const extraReducers = (builder: ActionReducerMapBuilder<UILogPanelSlice>) => {
  builder.addMatcher(appApi.endpoints.getLogMessages.matchFulfilled, (state, { payload: logMessages }) => {
    state.logMessages = checkMessages(logMessages);
  });
  builder.addMatcher(appApi.endpoints.clearLogMessages.matchFulfilled, (state) => {
    state.logMessages = [];
  });
};
