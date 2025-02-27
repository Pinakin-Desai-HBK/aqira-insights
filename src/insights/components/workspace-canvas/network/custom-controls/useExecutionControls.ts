import { useCallback, useEffect, useMemo, useState } from "react";
import { Workspace } from "src/insights/redux/types/schemas/project";
import {
  useAbortNetworkRunMutation,
  useGetNetworkRunListQuery,
  useStartNetworkRunMutation
} from "src/insights/redux/api/appApi";
import { NetworkRunMap } from "./NetworkRunToastMap";
import { NetworkRunDetails } from "src/insights/redux/types/schemas/networkRun";

export const useExecutionControls = (workspace: Workspace) => {
  const { data: networkRunList } = useGetNetworkRunListQuery();
  const [waitingForRunStatusUpdate, setWaitingForRunStatusUpdate] = useState(false);

  const [networkRunStatus, setNetworkRunStatus] = useState<NetworkRunDetails | null>(null);
  useEffect(() => {
    if (!networkRunList) return;
    const networkRunStatus = networkRunList
      ? networkRunList.find((networkRun) => networkRun.networkId === workspace.id)
      : null;
    setNetworkRunStatus(networkRunStatus ?? null);
  }, [networkRunList, workspace.id]);

  const buttonState = useMemo(() => {
    setWaitingForRunStatusUpdate(false);
    return networkRunStatus
      ? NetworkRunMap[networkRunStatus?.status].buttonState
      : { show: "run", enabled: true, tooltip: "Run Network" };
  }, [networkRunStatus]);

  const [startNetworkRun] = useStartNetworkRunMutation();
  const [abortNetworkRun] = useAbortNetworkRunMutation();

  const run = useCallback(async () => {
    setWaitingForRunStatusUpdate(true);
    const { error } = await startNetworkRun({ networkId: workspace.id });
    if (error) {
      console.log("Error starting network run: ", error);
    }
  }, [startNetworkRun, workspace.id]);

  const stop = useCallback(async () => {
    if (networkRunStatus === null || networkRunStatus.runId === null) return;
    setWaitingForRunStatusUpdate(true);
    const { error } = await abortNetworkRun({ runId: networkRunStatus.runId });
    if (error) {
      console.log("Error aborting network run: ", error);
    }
  }, [abortNetworkRun, networkRunStatus]);

  return {
    run,
    stop,
    buttonState,
    waitingForRunStatusUpdate
  };
};
