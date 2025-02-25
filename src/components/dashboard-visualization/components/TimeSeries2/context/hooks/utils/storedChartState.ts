import { StoredChartState } from "../../../types";

const getStoredChartState = ({
  dashboardId,
  visualizationId
}: {
  dashboardId: string;
  visualizationId: string;
}): StoredChartState | null =>
  JSON.parse(localStorage.getItem(`timeSeriesStoredChartState-${dashboardId}-${visualizationId}`) || "null");

const setStoredChartState = ({
  dashboardId,
  visualizationId,
  newStoredChartState
}: {
  dashboardId: string;
  visualizationId: string;
  newStoredChartState: Partial<StoredChartState>;
}) =>
  localStorage.setItem(
    `timeSeriesStoredChartState-${dashboardId}-${visualizationId}`,
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
      hiddenColumns: storedChartState?.hiddenColumns ?? null,
      range: storedChartState?.range ?? null,
      showMarkers: storedChartState?.showMarkers ?? null,
      showMinimap: storedChartState?.showMinimap ?? null,
      tooltipsEnabled: storedChartState?.tooltipsEnabled ?? null
    };
  };
  const getHiddenColumns = () => getChartState()?.hiddenColumns ?? null;
  const getRange = () => getChartState()?.range ?? null;
  const getShowMarkers = () => getChartState()?.showMarkers ?? null;
  const getShowMinimap = () => getChartState()?.showMinimap ?? null;
  const getTooltipsEnabled = () => getChartState()?.tooltipsEnabled ?? null;
  return {
    getChartState,
    getConfig,
    getHiddenColumns,
    getRange,
    getShowMarkers,
    getShowMinimap,
    getTooltipsEnabled,
    setStoredChartState: (newStoredChartState: Partial<StoredChartState>) =>
      setStoredChartState({ dashboardId, visualizationId, newStoredChartState })
  };
};
