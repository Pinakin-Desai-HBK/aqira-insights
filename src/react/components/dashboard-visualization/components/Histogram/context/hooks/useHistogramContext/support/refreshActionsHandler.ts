import { ToolbarSetActionsHandlers } from "src/react/redux/types/ui/toolbar";
import { RefreshActionsHandlerParams } from "../../../../types";
import { getConfigHelpers } from "./storedChartState";

export const refreshActionsHandler = ({
  key,
  handlerSetters,
  closeInformationDialog,
  openInformationDialog,
  updateMode,
  updateScaleType,
  updateTooltipsEnabled,
  updateShowMinimap,
  resetZoom,
  isZoomed,
  dashboardId,
  visualizationId
}: RefreshActionsHandlerParams) => {
  const { getMode, getScaleType, getShowMinimap, getTooltipEnabled } = getConfigHelpers({
    dashboardId,
    visualizationId
  });
  if (!handlerSetters || key !== "DashboardCanvas-ViewModeNode-Histogram") return;

  const viewHandlerSetters = handlerSetters as ToolbarSetActionsHandlers<typeof key>;
  viewHandlerSetters.setControlSummary({
    callbacks: {
      onClick: () =>
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
              heading: "Select series",
              content: {
                columns: 2,
                rowTemplate: ["40%", "auto"],
                rows: [
                  [
                    "Navigate available series",
                    "Left mouse button click - on navigation controls either side of current series name"
                  ],
                  ["Select series", "Left mouse button click - on current series name and select from dropdown"]
                ]
              }
            },
            {
              type: "contentWithHeading",
              heading: "Select index",
              content: {
                columns: 2,
                rowTemplate: ["40%", "auto"],
                rows: [["Select Index", "Left mouse button click - on index marker in index selection control"]]
              }
            }
          ],
          title: "Controls Summary",
          onOk: () => {
            closeInformationDialog();
          }
        }),
      isVisible: () => true
    }
  });
  viewHandlerSetters.setBinsDisabled({
    callbacks: {
      onClick: () => updateMode("showBins"),
      isVisible: () => getMode() !== "showBins"
    }
  });
  viewHandlerSetters.setShowBins({
    callbacks: {
      onClick: () => null,
      isVisible: () => getMode() === "showBins"
    }
  });
  viewHandlerSetters.setLinesDisabled({
    callbacks: {
      onClick: () => updateMode("showLines"),
      isVisible: () => getMode() !== "showLines"
    }
  });
  viewHandlerSetters.setShowLines({
    callbacks: {
      onClick: () => null,
      isVisible: () => getMode() === "showLines"
    }
  });
  viewHandlerSetters.setLinesAndPointsDisabled({
    callbacks: {
      onClick: () => updateMode("showLinesAndPoints"),
      isVisible: () => getMode() !== "showLinesAndPoints"
    }
  });
  viewHandlerSetters.setShowLinesAndPoints({
    callbacks: {
      onClick: () => null,
      isVisible: () => getMode() === "showLinesAndPoints"
    }
  });
  viewHandlerSetters.setShowLinearScale({
    callbacks: {
      onClick: () => updateScaleType("linear"),
      isVisible: () => getScaleType() === "logarithmic"
    }
  });
  viewHandlerSetters.setEnableTooltips({
    callbacks: {
      onClick: () => updateTooltipsEnabled(true),
      isVisible: () => getTooltipEnabled() === false
    }
  });
  viewHandlerSetters.setDisableTooltips({
    callbacks: {
      onClick: () => updateTooltipsEnabled(false),
      isVisible: () => getTooltipEnabled() === true
    }
  });
  viewHandlerSetters.setShowLogarithmicScale({
    callbacks: {
      onClick: () => updateScaleType("logarithmic"),
      isVisible: () => getScaleType() === "linear"
    }
  });
  viewHandlerSetters.setResetZoom({
    callbacks: {
      onClick: () => resetZoom(),
      isVisible: () => isZoomed()
    }
  });
  viewHandlerSetters.setHideMinimap({
    callbacks: {
      onClick: () => updateShowMinimap(false),
      isVisible: () => getShowMinimap() === true
    }
  });
  viewHandlerSetters.setShowMinimap({
    callbacks: {
      onClick: () => updateShowMinimap(true),
      isVisible: () => getShowMinimap() === false
    }
  });
};
