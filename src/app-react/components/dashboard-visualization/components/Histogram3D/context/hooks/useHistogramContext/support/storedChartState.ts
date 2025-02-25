import { StoredChartState } from "../../../../types";

const getStoredChartState = ({
  dashboardId,
  visualizationId
}: {
  dashboardId: string;
  visualizationId: string;
}): StoredChartState | null =>
  JSON.parse(localStorage.getItem(`histogram3DStoredChartState-${dashboardId}-${visualizationId}`) || "null");

export const setStoredChartState = ({
  dashboardId,
  visualizationId,
  newStoredChartState
}: {
  dashboardId: string;
  visualizationId: string;
  newStoredChartState: Partial<StoredChartState>;
}) =>
  localStorage.setItem(
    `histogram3DStoredChartState-${dashboardId}-${visualizationId}`,
    JSON.stringify({ ...(getStoredChartState({ dashboardId, visualizationId }) ?? {}), ...newStoredChartState })
  );

export const getConfigHelpers = ({
  dashboardId,
  visualizationId
}: {
  dashboardId: string;
  visualizationId: string;
}) => {
  const getChartState = (): StoredChartState | null => getStoredChartState({ dashboardId, visualizationId });
  const getConfig = () => {
    const storedChartState = getChartState();
    return {
      selectedIndex: storedChartState?.selectedIndex ?? null,
      selectedChannel: storedChartState?.selectedChannel ?? null
    };
  };
  const getSelectedIndex = () => getChartState()?.selectedIndex ?? null;
  const getSelectedChannel = () => getChartState()?.selectedChannel ?? null;
  return {
    getChartState,
    getConfig,
    getSelectedIndex,
    getSelectedChannel
  };
};
