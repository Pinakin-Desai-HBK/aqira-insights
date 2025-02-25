import { TransitionProps } from "@mui/material/transitions";
import { ComponentType, ReactElement } from "react";

type ToastIconRef = "info" | "success" | "warning" | "error";

export type ToastContentDetails = {
  iconRef: ToastIconRef;
  iconColor: string;
  barColor: string;
};

export type ToastContent = {
  title: string;
  message?: string;
  iconRef?: ToastIconRef;
  barColor?: string;
  iconColor?: string;
};

export type TransitionComponent = ComponentType<
  TransitionProps & {
    children: ReactElement;
  }
>;

export type ToastIconLookupType = {
  [K in ToastIconRef]: React.ReactNode;
};
