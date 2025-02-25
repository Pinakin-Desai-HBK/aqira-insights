import { ToastContentDetails } from "./toast";

type ButtonState = {
  show: "run" | "stop";
  enabled: boolean;
  tooltip: string;
};

export type ToastMapEntry = {
  toastContentDetails: ToastContentDetails;
  buttonState: ButtonState;
};
