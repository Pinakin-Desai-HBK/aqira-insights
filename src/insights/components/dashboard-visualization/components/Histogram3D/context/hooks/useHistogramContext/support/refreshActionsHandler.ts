import { ToolbarSetActionsHandlers } from "src/insights/redux/types/ui/toolbar";
import { RefreshActionsHandlerParams } from "../../../../types";
import { getConfigHelpers } from "./storedChartState";

export const refreshActionsHandler = ({
  key,
  handlerSetters,
  closeInformationDialog,
  openInformationDialog,
  dashboardId,
  visualizationId
}: RefreshActionsHandlerParams) => {
  const {} = getConfigHelpers({
    dashboardId,
    visualizationId
  });
  if (!handlerSetters || key !== "DashboardCanvas-ViewModeNode-Histogram3D") return;

  const viewHandlerSetters = handlerSetters as ToolbarSetActionsHandlers<typeof key>;
  viewHandlerSetters.setControlSummary({
    callbacks: {
      onClick: () =>
        openInformationDialog({
          testidPrefix: "AI-controls-summary",
          contents: [],
          title: "Controls Summary",
          onOk: () => {
            closeInformationDialog();
          }
        }),
      isVisible: () => true
    }
  });
};
