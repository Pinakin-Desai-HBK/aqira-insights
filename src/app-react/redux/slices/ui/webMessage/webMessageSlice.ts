import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/redux/store";
import { UIWebMessageSlice } from "src/redux/types/redux/webMessage";
import { reducers } from "./reducers";

const getInitialState = (): UIWebMessageSlice => ({
  webMessageResponse: null
});

export const uiWebMessage = createSlice({
  name: "uiWebMessage",
  initialState: getInitialState(),
  reducers
});

export const { uiWebMessage_setWebMessageResponse } = uiWebMessage.actions;

export const selectStore_UI_WebMessage = (state: RootState) => state.ui.webMessage;
