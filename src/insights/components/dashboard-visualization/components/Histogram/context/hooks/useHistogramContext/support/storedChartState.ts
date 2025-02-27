import { StoredChartState } from "../../../../types";

const getStoredChartState = ({
  dashboardId,
  visualizationId
}: {
  dashboardId: string;
  visualizationId: string;
}): StoredChartState | null =>
  JSON.parse(localStorage.getItem(`histogramStoredChartState-${dashboardId}-${visualizationId}`) || "null");

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
    `histogramStoredChartState-${dashboardId}-${visualizationId}`,
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
      mode: storedChartState?.mode ?? "showBins",
      scaleType: storedChartState?.scaleType ?? "linear",
      tooltipsEnabled: storedChartState?.tooltipsEnabled !== false,
      showMinimap: storedChartState?.showMinimap !== false,
      tickType: storedChartState?.tickType ?? "center",
      zoomRange: storedChartState?.zoomRange ?? null,
      selectedIndex: storedChartState?.selectedIndex ?? null,
      selectedChannel: storedChartState?.selectedChannel ?? null
    };
  };
  const getMode = () => getConfig().mode;
  const getScaleType = () => getConfig().scaleType;
  const getTooltipEnabled = () => getConfig().tooltipsEnabled;
  const getShowMinimap = () => getConfig().showMinimap;
  const getTickType = () => getConfig().tickType;
  const getZoomRange = () => getConfig().zoomRange;
  const getSelectedIndex = () => getChartState()?.selectedIndex ?? null;
  const getSelectedChannel = () => getChartState()?.selectedChannel ?? null;
  return {
    getChartState,
    getMode,
    getScaleType,
    getTooltipEnabled,
    getShowMinimap,
    getTickType,
    getZoomRange,
    getConfig,
    getSelectedIndex,
    getSelectedChannel
  };
};
