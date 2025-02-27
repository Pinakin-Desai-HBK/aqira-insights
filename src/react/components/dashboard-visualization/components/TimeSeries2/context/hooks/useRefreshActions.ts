import { useCallback, useContext } from "react";
import { DialogContext } from "../../../../../dialog/context/DialogContext";
import { NodeToolbarContext } from "../../../../toolbar/context/ToolbarContext";
import { ToolbarContextData, ToolbarSetActionsHandlers } from "src/react/redux/types/ui/toolbar";
import { ChartData, RefreshActionsParams, StoredChartState, UseRefreshActionsParams } from "../../types";
import { CursorModifier, EllipsePointMarker } from "scichart";
import { updateStoredHiddenColumns } from "../../utils/updateStoredHiddenColumns";
import { ActionsInformationDialogParams } from "../../../Shared/types";
import { isAnySeriesHidden } from "./utils/isAnySeriesHidden";
import { isAnySeriesVisible } from "./utils/isAnySeriesVisible";
import { isZoomed } from "./utils/isZoomed";
import { updateYRange } from "../../chart/utils/updateYRange";

export const useRefreshActions = ({ resetZoom, setStoredChartState }: UseRefreshActionsParams) => {
  const { closeDialog, openDialog } = useContext(DialogContext);
  const { handlerSetters, key } = useContext(
    NodeToolbarContext
  ) as ToolbarContextData<"DashboardCanvas-ViewModeNode-TimeSeries">;

  const handler = useCallback(
    (chartData: ChartData) => {
      if (!chartData.wasmContext) return;
      refreshActionsHandler({
        key,
        chartData,
        resetZoom,
        handlerSetters,
        openInformationDialog: (props) => props && openDialog({ name: "InformationDialog", props }),
        closeInformationDialog: closeDialog,
        setStoredChartState
      });
    },
    [key, resetZoom, handlerSetters, closeDialog, setStoredChartState, openDialog]
  );

  return handler;
};

const refreshActionsHandler = (
  params: RefreshActionsParams &
    ActionsInformationDialogParams & {
      setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void;
    }
) => {
  const {
    key,
    chartData,
    resetZoom,
    handlerSetters,
    closeInformationDialog,
    openInformationDialog,
    setStoredChartState
  } = params;
  if (!handlerSetters) return;
  const { chartSurface, overview, dataSetId, wasmContext } = chartData;
  if (!chartSurface || !overview || !wasmContext || !dataSetId) return;
  if (key === "DashboardCanvas-ViewModeNode-TimeSeries") {
    const viewHandlerSetters = handlerSetters as ToolbarSetActionsHandlers<typeof key>;
    viewHandlerSetters.setShowMarkers({
      callbacks: {
        onClick: () => {
          chartSurface.renderableSeries.asArray().forEach((series) => {
            series.pointMarker = new EllipsePointMarker(wasmContext, {
              width: 6,
              height: 6,
              opacity: 1,
              fill: series.stroke,
              stroke: series.stroke
            });
          });
          setStoredChartState({ newStoredChartState: { showMarkers: true } });
          chartSurface.invalidateElement();
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => {
          if (!chartSurface) return false;
          const firstSeries = chartSurface.renderableSeries.get(0);
          return firstSeries && firstSeries.pointMarker === undefined;
        }
      }
    });
    viewHandlerSetters.setHideMarkers({
      callbacks: {
        onClick: () => {
          chartSurface.renderableSeries.asArray().forEach((series) => {
            series.pointMarker = undefined;
          });
          setStoredChartState({ newStoredChartState: { showMarkers: false } });
          chartSurface.invalidateElement();
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => {
          const firstSeries = chartSurface.renderableSeries.get(0);
          return firstSeries && firstSeries.pointMarker !== undefined;
        }
      }
    });
    viewHandlerSetters.setResetZoom({
      callbacks: {
        onClick: () => {
          resetZoom();
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => isZoomed(chartSurface, overview)
      }
    });
    viewHandlerSetters.setSelectAllDataSeries({
      callbacks: {
        onClick: () => {
          chartSurface.renderableSeries.asArray().forEach((series) => (series.isVisible = true));
          updateStoredHiddenColumns({
            chart: chartSurface,
            dataSetId,
            setStoredChartState
          });
          setTimeout(() => {
            updateYRange(chartSurface);
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => isAnySeriesHidden(chartSurface)
      }
    });
    viewHandlerSetters.setDeselectAllDataSeries({
      callbacks: {
        onClick: () => {
          chartSurface.renderableSeries.asArray().forEach((series) => (series.isVisible = false));
          updateStoredHiddenColumns({
            chart: chartSurface,
            dataSetId,
            setStoredChartState
          });
          setTimeout(() => {
            updateYRange(chartSurface);
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => isAnySeriesVisible(chartSurface)
      }
    });
    viewHandlerSetters.setEnableTooltips({
      callbacks: {
        onClick: () => {
          chartSurface.chartModifiers.asArray().forEach((modifier) => {
            if (modifier instanceof CursorModifier) {
              modifier.showTooltip = true;
            }
          });
          setStoredChartState({ newStoredChartState: { tooltipsEnabled: true } });
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => {
          const modifier = chartSurface.chartModifiers
            .asArray()
            .find((modifier) => modifier instanceof CursorModifier) as CursorModifier;
          return modifier && modifier.showTooltip === false;
        }
      }
    });
    viewHandlerSetters.setDisableTooltips({
      callbacks: {
        onClick: () => {
          chartSurface.chartModifiers.asArray().forEach((modifier) => {
            if (modifier instanceof CursorModifier) {
              modifier.showTooltip = false;
            }
          });
          setStoredChartState({ newStoredChartState: { tooltipsEnabled: false } });
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () => {
          const modifier = chartSurface.chartModifiers
            .asArray()
            .find((modifier) => modifier instanceof CursorModifier) as CursorModifier;
          return modifier && modifier.showTooltip === true;
        }
      }
    });
    viewHandlerSetters.setShowMinimap({
      callbacks: {
        onClick: () => {
          overview.overviewSciChartSurface.domChartRoot.style.display = "block";
          setStoredChartState({ newStoredChartState: { showMinimap: true } });
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () =>
          !overview.overviewSciChartSurface.domChartRoot ||
          !overview.overviewSciChartSurface.domChartRoot.style.display ||
          overview.overviewSciChartSurface.domChartRoot.style.display === "none"
      }
    });
    viewHandlerSetters.setHideMinimap({
      callbacks: {
        onClick: () => {
          overview.overviewSciChartSurface.domChartRoot.style.display = "none";
          setStoredChartState({ newStoredChartState: { showMinimap: false } });
          setTimeout(() => {
            refreshActionsHandler(params);
          }, 0);
        },
        isVisible: () =>
          overview.overviewSciChartSurface.domChartRoot &&
          overview.overviewSciChartSurface.domChartRoot.style.display === "block"
      }
    });
    viewHandlerSetters.setControlSummary({
      callbacks: {
        onClick: () => {
          openInformationDialog({
            testidPrefix: "AI-controls-summary",
            contents: [
              {
                type: "contentWithHeading",
                heading: "Zoom",
                content: {
                  columns: 2,
                  rowTemplate: ["40%", "auto"],
                  rows: [
                    ["Resize viewed area", "Left mouse button drag - on mini-map handles"],
                    ["Refine viewed area", "Left mouse button drag (drag rectangle) - on main chart"],
                    ["Reset zoom", "Left mouse button double click - on main chart"]
                  ]
                }
              },
              {
                type: "contentWithHeading",
                heading: "Pan (if zoomed)",
                content: {
                  columns: 2,
                  rowTemplate: ["40%", "auto"],
                  rows: [
                    ["Pan viewed area", "Right mouse button drag - on main chart"],
                    ["Pan viewed area", "Left or right mouse button drag - between mini-map handles"]
                  ]
                }
              },
              {
                type: "contentWithHeading",
                heading: "Data Series Visibility",
                content: {
                  columns: 2,
                  rowTemplate: ["40%", "auto"],
                  rows: [
                    ["Show/hide data series", "Click specific data series in legend (toggle)"],
                    ["Hide all data series", "Left mouse button click 'Deselect all data series' in toolbar"],
                    ["Show all data series", "Left mouse button click 'Select all data series' button in toolbar"]
                  ]
                }
              }
            ],
            title: "Controls Summary",
            onOk: () => {
              closeInformationDialog();
            }
          });
        },
        isVisible: () => true
      }
    });
  }
};
