import { useCallback, useEffect } from "react";
import usePubSubManager from "../pubsub-manager/usePubSubManager";
import { SubscriberTypes } from "../redux/types/system/pub-sub";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { selectStore_UI_Project_WorkspaceList } from "src/insights/redux/slices/ui/project/projectSlice";
import { popoutDetails } from "src/insights/popoutDetails";
import { uiToast_add } from "src/insights/redux/slices/ui/toast/toastSlice";
import { NetworkRunMap } from "src/insights/components/workspace-canvas/network/custom-controls/NetworkRunToastMap";
import { SignalRRunHiddenNetworkStateChangeEvent } from "src/insights/redux/types/schemas/hiddenNetworkRun";

export const useHiddenNetworkRun = () => {
  const { popoutId, isPopout } = popoutDetails;
  const workspaces = useAppSelector(selectStore_UI_Project_WorkspaceList);
  const subscriberType = isPopout ? SubscriberTypes.POPUP : SubscriberTypes.MAIN;
  const pubSub = usePubSubManager();
  const appDispatch = useAppDispatch();

  const getMessage = (status: keyof typeof NetworkRunMap, visualizationName: string) => {
    return status === "Running" ? `Loading ${visualizationName}` : `${status} for ${visualizationName}`;
  };

  const processHiddenNetworkRun = useCallback(
    (networkRun: SignalRRunHiddenNetworkStateChangeEvent) => {
      const networkRunDetails = {
        workspaceId: networkRun.id,
        runId: networkRun.runId,
        status: networkRun.state as keyof typeof NetworkRunMap
      };

      appDispatch(
        uiToast_add({
          content: {
            title: "File Display Status",
            message: getMessage(networkRunDetails.status, networkRun.visualizationName),
            ...NetworkRunMap[networkRunDetails.status].toastContentDetails
          }
        })
      );
    },
    [appDispatch]
  );

  useEffect(() => {
    const unsubscribe = [
      ...(workspaces !== undefined
        ? workspaces.map(() =>
            pubSub.subscribe(
              "S2C-RunHiddenNetworkStateChangeEvent",
              ({ message }: { message: SignalRRunHiddenNetworkStateChangeEvent }) => {
                console.log("Network Run State Change Event", message);
                processHiddenNetworkRun(message);
              },
              subscriberType,
              popoutId
            )
          )
        : [])
    ];
    return () => {
      unsubscribe.forEach((u) => u());
    };
  }, [isPopout, popoutId, processHiddenNetworkRun, pubSub, subscriberType, workspaces]);
};
