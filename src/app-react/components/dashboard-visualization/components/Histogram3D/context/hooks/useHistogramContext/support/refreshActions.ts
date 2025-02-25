import { DialogContextData, InformationDialogParams } from "src/redux/types/ui/dialogs";
import { ToolbarContextData } from "src/redux/types/ui/toolbar";
import { refreshActionsHandler } from "./refreshActionsHandler";

export const refreshActions = ({
  closeDialog,
  dashboardId,
  handlerSetters,
  key,
  openDialog,
  visualizationId
}: {
  key: string;
  handlerSetters: ToolbarContextData<"DashboardCanvas-ViewModeNode-Histogram3D">["handlerSetters"];
  dashboardId: string;
  visualizationId: string;
  openDialog: DialogContextData["openDialog"];
  closeDialog: DialogContextData["closeDialog"];
}) => {
  const openInformationDialog = (props: InformationDialogParams) => {
    if (props) openDialog({ name: "InformationDialog", props });
  };

  refreshActionsHandler({
    key,
    handlerSetters,
    openInformationDialog,
    closeInformationDialog: closeDialog,
    dashboardId,
    visualizationId
  });
};
