import { ConfirmDialogParams } from "src/insights/redux/types/ui/dialogs";
import BaseDialog from "../support/BaseDialog";

const ConfirmDialog = (props: ConfirmDialogParams) => (
  <BaseDialog
    testidPrefix="ConfirmDialog"
    {...props}
    close={props.onCancel}
    buttons={[
      {
        callback: props.onCancel,
        label: "Cancel",
        disabled: false,
        testidSuffix: "CancelButton"
      },
      {
        callback: props.onOk,
        label: props.okLabel || "Confirm",
        disabled: false,
        testidSuffix: "ConfirmButton"
      }
    ]}
  />
);
ConfirmDialog.displayName = "ConfirmDialog" as const;

export default ConfirmDialog;
