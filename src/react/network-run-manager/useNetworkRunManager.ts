import { useCallback, useEffect } from "react";
import usePubSubManager from "../pubsub-manager/usePubSubManager";
import { SubscriberTypes } from "../redux/types/system/pub-sub";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { NetworkRunDetails } from "src/react/redux/types/schemas/networkRun";
import { selectStore_UI_Project_WorkspaceList } from "src/react/redux/slices/ui/project/projectSlice";
import { popoutDetails } from "src/react/popoutDetails";
import { uiToast_add } from "src/react/redux/slices/ui/toast/toastSlice";
import { NetworkRunMap } from "src/react/components/workspace-canvas/network/custom-controls/NetworkRunToastMap";
import { useTagInvalidation } from "src/react/tag-invalidation/useTagInvalidation";

export const useNetworkRunManager = () => {
  const { popoutId, isPopout } = popoutDetails;
  const workspaces = useAppSelector(selectStore_UI_Project_WorkspaceList);
  const subscriberType = isPopout ? SubscriberTypes.POPUP : SubscriberTypes.MAIN;
  const pubSub = usePubSubManager();
  const { invalidateTags } = useTagInvalidation();
  const appDispatch = useAppDispatch();

  const processNetworkRun = useCallback(
    (networkRun: NetworkRunDetails) => {
      const found =
        workspaces !== undefined
          ? workspaces.find((tab) => {
              return tab.id === networkRun.networkId;
            })
          : null;
      const networkRunDetails = {
        workspaceId: networkRun.networkId,
        runId: networkRun.runId,
        status: networkRun.status
      };

      if (found && ((isPopout && popoutId === found.id) || !isPopout) && networkRunDetails.status !== "Running") {
        appDispatch(
          uiToast_add({
            content: {
              title: "Network Run Status",
              message: networkRunDetails.status + " for " + found.name,
              ...NetworkRunMap[networkRunDetails.status].toastContentDetails
            }
          })
        );
      }
      if (!isPopout) {
        invalidateTags({
          tags: [{ type: "NetworkRun", id: "LIST" }],
          recipientType: "ALL",
          sourcePopoutId: popoutDetails.popoutId
        });
      }
    },
    [appDispatch, isPopout, popoutId, invalidateTags, workspaces]
  );

  useEffect(() => {
    const unsubscribe = [
      ...(workspaces !== undefined
        ? workspaces.map(({ id }) =>
            pubSub.subscribe(
              `S2CG-RunStateChangeEvent-${id}`,
              ({ message }) => {
                console.log("Network Run State Change Event", message);
                processNetworkRun({
                  failureMsg: message.failureMsg,
                  networkId: message.networkId,
                  runId: message.runId,
                  status: message.state,
                  networkName: message.id
                });
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
  }, [isPopout, popoutId, processNetworkRun, pubSub, subscriberType, workspaces]);
};
