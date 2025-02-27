import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/insights/redux/store";
import { reducers } from "./reducers";
import { UIToastSlice } from "src/insights/redux/types/redux/toast";

const getInitialState = (): UIToastSlice => ({
  stack: [],
  current: null,
  open: false,
  counter: 0
});

export const uiToast = createSlice({
  name: "uiToast",
  initialState: getInitialState(),
  reducers
});

export const { uiToast_add, uiToast_removeFirst } = uiToast.actions;

export const selectStore_UI_Toast = (state: RootState) => state.ui.toast;
