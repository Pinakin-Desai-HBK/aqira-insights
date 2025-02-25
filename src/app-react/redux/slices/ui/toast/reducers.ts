import { PayloadAction } from "@reduxjs/toolkit";
import { UIToastSlice } from "src/redux/types/redux/toast";
import { ToastContent } from "src/redux/types/ui/toast";

export const reducers = {
  uiToast_add: (state: UIToastSlice, action: PayloadAction<{ content: ToastContent }>) => {
    const { content } = action.payload;
    if (state.current) {
      state.open = true;
      state.stack = [...state.stack, content];
    } else {
      state.open = true;
      state.current = content;
      state.counter = state.counter + 1;
    }
  },
  uiToast_removeFirst: (state: UIToastSlice) => {
    const current = state.stack.length > 0 ? state.stack[0] : null;
    state.open = !!current;
    state.current = current ?? null;
    state.stack = state.stack.slice(1);
    state.counter = state.counter + 1;
  }
};
