import { useState } from "react";
import BaseDialog from "../support/BaseDialog";
import DialogCheckbox from "../support/DialogCheckbox";
import { CheckBoxDialogParams } from "src/redux/types/ui/dialogs";

const CheckboxDialog = (props: CheckBoxDialogParams) => {
  const [checked, setChecked] = useState(props.checkBoxProps.checked);
  return (
    <BaseDialog
      testidPrefix="ConfirmDialog"
      {...props}
      buttons={[
        {
          callback: props.onCancel,
          label: "Cancel",
          disabled: false,
          testidSuffix: "CancelButton"
        },
        {
          callback: () => props.onOk(checked),
          label: props.okLabel || "Confirm",
          disabled: false,
          testidSuffix: "YesButton"
        }
      ]}
      close={props.onCancel}
    >
      <DialogCheckbox
        {...props.checkBoxProps}
        onChange={(e) => {
          setChecked(!e.target.checked);
        }}
      />
    </BaseDialog>
  );
};
CheckboxDialog.displayName = "CheckboxDialog" as const;

export default CheckboxDialog;
