import { DialogContextData, InformationDialogParams } from "src/redux/types/ui/dialogs";
import { ChartData, UpdateMode, UpdateScaleType, UpdateTickType, UpdateTooltipsEnabled } from "../../../../types";
import { setStoredChartState } from "./storedChartState";
import { updateSeriesVisibility } from "../../../../chart/utils/updateSeriesVisibility";
import { isZoomed } from "src/components/dashboard-visualization/components/TimeSeries2/context/hooks/utils/isZoomed";
import { getConfigHelpers } from "./storedChartState";
import { ToolbarContextData } from "src/redux/types/ui/toolbar";
import { updateChartModifiers } from "./updateChartModifiers";
import { refreshActionsHandler } from "./refreshActionsHandler";
import { RefObject } from "react";

export const refreshActions = ({
  chartData,
  closeDialog,
  dashboardId,
  handlerSetters,
  triggerRefresh,
  triggerRefreshImmediate,
  key,
  openDialog,
  refreshActionsRef,
  visualizationId
}: {
  key: string;
  handlerSetters: ToolbarContextData<"DashboardCanvas-ViewModeNode-Histogram">["handlerSetters"];
  triggerRefresh: () => void;
  triggerRefreshImmediate: () => void;
  chartData: ChartData;
  dashboardId: string;
  visualizationId: string;
  refreshActionsRef: RefObject<(() => void) | null>;
  openDialog: DialogContextData["openDialog"];
  closeDialog: DialogContextData["closeDialog"];
}) => {
  const updateMode: UpdateMode = (mode) => {
    setStoredChartState({ newStoredChartState: { mode }, dashboardId, visualizationId });
    const { getTooltipEnabled } = getConfigHelpers({ dashboardId, visualizationId });
    const tooltipsEnabled = getTooltipEnabled();
    updateChartModifiers(chartData, mode, tooltipsEnabled);
    setTimeout(() => {
      if (chartData.refs) updateSeriesVisibility(chartData.refs, mode, chartData.data?.binWidth || 0);
    }, 0);
    triggerRefreshImmediate();
    if (refreshActionsRef.current) refreshActionsRef.current();
  };
  const updateScaleType: UpdateScaleType = (scaleType) => {
    setStoredChartState({ newStoredChartState: { scaleType }, dashboardId, visualizationId });
    triggerRefresh();
    if (refreshActionsRef.current) refreshActionsRef.current();
  };
  const updateTickType: UpdateTickType = (tickType) => {
    setStoredChartState({ newStoredChartState: { tickType }, dashboardId, visualizationId });
    triggerRefresh();
    if (refreshActionsRef.current) refreshActionsRef.current();
  };
  const updateTooltipsEnabled: UpdateTooltipsEnabled = (tooltipsEnabled: boolean) => {
    setStoredChartState({ newStoredChartState: { tooltipsEnabled }, dashboardId, visualizationId });
    const { getMode } = getConfigHelpers({ dashboardId, visualizationId });
    updateChartModifiers(chartData, getMode(), tooltipsEnabled);
    if (refreshActionsRef.current) refreshActionsRef.current();
  };
  const updateShowMinimap = (showMinimap: boolean) => {
    setStoredChartState({ newStoredChartState: { showMinimap }, dashboardId, visualizationId });
    if (chartData.refs) {
      chartData.refs.overview.overviewSciChartSurface.domChartRoot.style.height = showMinimap ? "10%" : "0px";
      chartData.refs.chartSurface.domChartRoot.style.height = showMinimap ? "90%" : "100%";
    }
    if (refreshActionsRef.current) refreshActionsRef.current();
  };
  const resetZoom = () => {
    const refs = chartData.refs;
    if (!refs) return;
    refs.chartSurface.zoomExtents();
    setStoredChartState({ newStoredChartState: { zoomRange: null }, dashboardId, visualizationId });
    if (refreshActionsRef.current) refreshActionsRef.current();
  };
  const isZoomedCallback = () => {
    const refs = chartData.refs;
    if (!refs) return false;
    const zoomRange = refs.chartSurface.xAxes.get(0).visibleRange;
    setStoredChartState({
      newStoredChartState: { zoomRange },
      dashboardId,
      visualizationId
    });
    return isZoomed(chartData.refs?.chartSurface || null, chartData.refs?.overview || null);
  };
  const openInformationDialog = (props: InformationDialogParams) => {
    if (props) openDialog({ name: "InformationDialog", props });
  };

  refreshActionsHandler({
    key,
    handlerSetters,
    openInformationDialog,
    closeInformationDialog: closeDialog,
    dashboardId,
    visualizationId,
    updateMode,
    updateScaleType,
    updateTickType,
    updateTooltipsEnabled,
    updateShowMinimap,
    resetZoom,
    isZoomed: isZoomedCallback
  });
};
