import { memo, useCallback, useEffect, useState } from "react";
import "./Main.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Error";
import { useGetCurrentProjectQuery, useGetWorkspacesQuery, appApi } from "../../redux/api/appApi";
import { DialogContext } from "../dialog/context/DialogContext";
import MainContent from "./MainContent";
import { getAppSignalR } from "../../signalR/AppSignalR";
import { popoutDetails } from "src/react/popoutDetails";
import { useClosePopoutHandler } from "./hooks/useClosePopoutHandler";
import { useStatusMessageManager } from "../dialog/hooks/useStatusMessageManager";
import {
  selectStore_UI_Project_WorkspaceList,
  uiProject_setSelectedWorkspace
} from "src/react/redux/slices/ui/project/projectSlice";
import { useAppDispatch, useAppSelector } from "src/react/redux/hooks/hooks";
import { useNetworkRunManager } from "src/react/network-run-manager/useNetworkRunManager";
import usePubSubManager from "src/react/pubsub-manager/usePubSubManager";
import { DialogsRenderer } from "../dialog/DialogsRenderer";
import { StatusDialogRenderer } from "../dialog/StatusDialogRenderer";
import { useDialogContext } from "../dialog/context/useDialogContext";
import { store } from "src/react/redux/store";
import { useHiddenNetworkRun } from "src/react/network-run-manager/useHiddenNetworkRunManager";
import { useChartManager } from "../dashboard-visualization/chartManager/useChartManagerr";
import { useStoreStaticData } from "./hooks/useStoreStaticData";
import { GlobalSpeedDial } from "../globalSpeedDial/GlobalSpeedDial";
import { setSciChart3DKey, setSciChartKey } from "sciChart/key/sciChartKey";
import { useToastManager } from "../toast/useToastManager";
import { SubscriberTypes } from "src/react/redux/types/system/pub-sub";
import { uiLogPanel_addLogMessage } from "src/react/redux/slices/ui/logPanel/logPanelSlice";

const Main = memo(() => {
  const loaded = useStoreStaticData();
  const dispatch = useAppDispatch();
  useGetCurrentProjectQuery();
  useGetWorkspacesQuery();
  const workspaces = useAppSelector(selectStore_UI_Project_WorkspaceList);
  useEffect(() => {
    if (popoutDetails.isPopout) {
      const workspace = workspaces.find((current) => current.id === popoutDetails.popoutId) ?? null;
      if (workspace) {
        dispatch(uiProject_setSelectedWorkspace(workspace));
      }
    }
  }, [dispatch, workspaces]);

  const pubSub = usePubSubManager();

  useEffect(() => {
    getAppSignalR(pubSub, () => {
      try {
        store.dispatch(appApi.util.resetApiState());
      } catch (e) {
        console.error(e);
      }
    });
  }, [pubSub]);

  return loaded ? (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DialogContextProvider />
    </ErrorBoundary>
  ) : null;
});
Main.displayName = "Main";

const DialogContextProvider = memo(() => {
  const dialogContextData = useDialogContext();
  return (
    <DialogContext.Provider value={dialogContextData}>
      <ManagersProvider />
    </DialogContext.Provider>
  );
});
DialogContextProvider.displayName = "DialogContextProvider";

const ManagersProvider = memo(() => {
  useClosePopoutHandler();
  useNetworkRunManager();
  useHiddenNetworkRun();
  useStatusMessageManager();
  useChartManager();
  useToastManager();

  const [inited, setInited] = useState<boolean>(false);

  const initSciChart = useCallback(async () => {
    // License validation is also triggered in each SciCharts visualization - this may be redundant, but it's extra safety
    setSciChartKey();
    setSciChart3DKey();

    //   try {
    //     const { sciChartSurface } = await SciChartSurface.create("scichart-init");
    //     sciChartSurface.delete();
    //   } catch (e) {
    //     console.log(e);
    //   }

    //   try {
    //     const { sciChart3DSurface } = await SciChart3DSurface.create("scichart-3D-init");
    //     sciChart3DSurface.delete();
    //   } catch (e) {
    //     console.log(e);
    //   }

    setTimeout(() => setInited(true), 0);
  }, []);

  useEffect(() => {
    initSciChart();
  }, [initSciChart]);

  const appDispatch = useAppDispatch();
  const pubSub = usePubSubManager();
  const { isPopout } = popoutDetails;
  useEffect(() => {
    if (isPopout) {
      return;
    }
    const unsubscribeCallbacks = [
      pubSub.subscribe(
        `S2C-LogMessageEvent`,
        ({ message }) => {
          appDispatch(uiLogPanel_addLogMessage({ logMessage: { ...message, timestamp: message.logMessageTimestamp } }));
        },
        SubscriberTypes.MAIN,
        null
      )
    ];
    return () => unsubscribeCallbacks.forEach((unsubscribeCallback) => unsubscribeCallback());
  }, [isPopout, pubSub, appDispatch]);

  return inited ? (
    <>
      <MainContent />
      <DialogsRenderer />
      <StatusDialogRenderer />
      <GlobalSpeedDial />
    </>
  ) : (
    <>
      <div id="scichart-init" style={{ display: "none" }} />
      <div id="scichart-3D-init" style={{ display: "none" }} />
    </>
  );
});
ManagersProvider.displayName = "ManagersProvider";

export default Main;
