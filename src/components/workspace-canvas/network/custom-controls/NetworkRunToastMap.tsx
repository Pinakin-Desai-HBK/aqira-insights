import {
  ToastErrorContent,
  ToastInfoContent,
  ToastSuccessContent,
  ToastWarningContent
} from "src/components/toast/ToastContent";
import { appLabels } from "src/consts/labels";
import { NetworkRunStatusValues } from "src/redux/types/schemas/networkRun";
import { ToastMapEntry } from "src/redux/types/ui/executionControls";

const labels = appLabels.NetworkRunMap;

export const NetworkRunMap: Record<NetworkRunStatusValues, ToastMapEntry> = {
  NotStarted: {
    toastContentDetails: ToastInfoContent,
    buttonState: { show: "run", enabled: false, tooltip: labels.runNetwork }
  },
  Running: {
    toastContentDetails: ToastInfoContent,
    buttonState: { show: "stop", enabled: true, tooltip: labels.stopNetworkRun }
  },
  Completed: {
    toastContentDetails: ToastSuccessContent,
    buttonState: { show: "run", enabled: true, tooltip: labels.runNetwork }
  },
  Failed: {
    toastContentDetails: ToastErrorContent,
    buttonState: { show: "run", enabled: true, tooltip: labels.runNetwork }
  },
  Aborted: {
    toastContentDetails: ToastInfoContent,
    buttonState: { show: "run", enabled: true, tooltip: labels.runNetwork }
  },
  Unknown: {
    toastContentDetails: ToastWarningContent,
    buttonState: { show: "run", enabled: true, tooltip: labels.runNetwork }
  }
};
