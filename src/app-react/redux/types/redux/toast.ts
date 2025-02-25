import { ToastContent } from "../ui/toast";

export type UIToastSlice = {
  open: boolean;
  stack: ToastContent[];
  current: ToastContent | null;
  counter: number;
};
