import { useContext, useEffect } from "react";
import { useAppSelector } from "src/redux/hooks/hooks";
import { selectStore_UI_App_StatusMessageParams } from "src/redux/slices/ui/app/uiAppSlice";
import { DialogContext } from "../context/DialogContext";
import { selectStore_UI_Project_SelectedWorkspace } from "src/redux/slices/ui/project/projectSlice";
import { popoutDetails } from "src/popoutDetails";

export const useStatusMessageManager = () => {
  const { statusDialogDetails, openStatusDialog, closeStatusDialog } = useContext(DialogContext);

  const newStatusMessageParams = useAppSelector(selectStore_UI_App_StatusMessageParams);
  const selectedWorkspace = useAppSelector(selectStore_UI_Project_SelectedWorkspace);
  const { isPopout } = popoutDetails;
  useEffect(() => {
    if (!newStatusMessageParams) {
      closeStatusDialog();
      return;
    }
    const noTarget =
      newStatusMessageParams.targetWorkspaceId === undefined && newStatusMessageParams.showInMain === undefined;
    const targetWorkspaceMatches =
      newStatusMessageParams.targetWorkspaceId !== undefined &&
      newStatusMessageParams.targetWorkspaceId === selectedWorkspace?.id;
    const showInMain = newStatusMessageParams.showInMain === true && !isPopout;
    const canShow = noTarget || targetWorkspaceMatches || showInMain;

    const canUseParams =
      !statusDialogDetails ||
      statusDialogDetails.props.title !== newStatusMessageParams.title ||
      statusDialogDetails.props.message !== newStatusMessageParams.message;

    if (canUseParams && canShow) {
      openStatusDialog({ name: "StatusMessageDialog", props: { ...newStatusMessageParams } });
    }
  }, [
    newStatusMessageParams,
    selectedWorkspace?.id,
    isPopout,
    statusDialogDetails,
    openStatusDialog,
    closeStatusDialog
  ]);
};
