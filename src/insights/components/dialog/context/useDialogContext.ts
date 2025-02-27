import { useCallback, useState } from "react";
import {
  DialogComponents,
  DialogContextData,
  DialogContextParams,
  DialogContextStatusParams
} from "src/insights/redux/types/ui/dialogs";
import StatusMessageDialog from "../dialogs/StatusMessageDialog";

export const useDialogContext = (): DialogContextData => {
  const [dialogDetails, openDialog] = useState<DialogContextParams<DialogComponents> | null>(null);
  const [statusDialogDetails, openStatusDialog] = useState<DialogContextStatusParams<
    typeof StatusMessageDialog
  > | null>(null);

  const closeDialog = useCallback(() => openDialog(null), []);
  const closeStatusDialog = useCallback(() => openStatusDialog(null), []);
  return {
    dialogDetails,
    openDialog,
    closeDialog,
    statusDialogDetails,
    openStatusDialog,
    closeStatusDialog
  };
};
