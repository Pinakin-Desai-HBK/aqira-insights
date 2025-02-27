import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { appApi } from "src/react/redux/api/appApi";
import { UILogPanelSlice } from "src/react/redux/types/redux/logMessage";
import { checkMessages } from "./support/utils";

export const extraReducers = (builder: ActionReducerMapBuilder<UILogPanelSlice>) => {
  builder.addMatcher(appApi.endpoints.getLogMessages.matchFulfilled, (state, { payload: logMessages }) => {
    state.logMessages = checkMessages(logMessages);
  });
  builder.addMatcher(appApi.endpoints.clearLogMessages.matchFulfilled, (state) => {
    state.logMessages = [];
  });
};
