import { PayloadAction } from "@reduxjs/toolkit";
import { UIWebMessageSlice, WebMessageResponse } from "src/insights/redux/types/redux/webMessage";

export const reducers = {
  uiWebMessage_setWebMessageResponse: (
    state: UIWebMessageSlice,
    action: PayloadAction<{ webMessageResponse: WebMessageResponse | null }>
  ) => {
    state.webMessageResponse = action.payload.webMessageResponse;
  }
};
