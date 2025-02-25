import { Cancel, CheckCircle, Info, Warning } from "@mui/icons-material";
import { ToastContentDetails, ToastIconLookupType } from "src/redux/types/ui/toast";

export const ToastIconLookup: ToastIconLookupType = {
  warning: <Warning />,
  info: <Info />,
  success: <CheckCircle />,
  error: <Cancel />
};

export const ToastWarningContent: ToastContentDetails = {
  iconRef: "warning",
  barColor: "#F0A633",
  iconColor: "#F0A633"
};

export const ToastInfoContent: ToastContentDetails = { iconRef: "info", barColor: "#009ECF", iconColor: "#009ECF" };

export const ToastSuccessContent: ToastContentDetails = {
  iconRef: "success",
  barColor: "#00985D",
  iconColor: "#00985D"
};

export const ToastErrorContent: ToastContentDetails = { iconRef: "error", barColor: "#CB2039", iconColor: "#CB2039" };
