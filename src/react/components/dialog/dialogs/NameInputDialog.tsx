import { ChangeEvent, KeyboardEvent, memo, useCallback, useState } from "react";
import BaseDialog from "../support/BaseDialog";
import DialogTextField from "../support/DialogTextField";
import { DialogTextFieldState, NameInputDialogParams } from "src/react/redux/types/ui/dialogs";

const NameInputDialog = memo((props: NameInputDialogParams) => {
  const { value, validator, onOk, onCancel } = props;
  const [fieldState, setFieldState] = useState<DialogTextFieldState>({
    value: value,
    error: false,
    helperText: ""
  });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const result = validator(value);
      const { valid } = result;
      setFieldState({
        error: valid ? false : true,
        value: value,
        helperText: valid ? "" : result.errorMessage
      });
    },
    [validator]
  );

  const getOKResult = useCallback(() => {
    return { value: fieldState.value };
  }, [fieldState]);

  const onKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !fieldState.error) onOk(getOKResult());
    },
    [fieldState.error, getOKResult, onOk]
  );
  return (
    <BaseDialog
      testidPrefix="AI-name-input-dialog"
      buttons={[
        {
          callback: onCancel,
          label: "Cancel",
          disabled: false,
          testidSuffix: "cancel-button"
        },
        {
          callback: () => onOk(getOKResult()),
          label: "Confirm",
          disabled: fieldState.error,
          testidSuffix: "confirm-button"
        }
      ]}
      close={onCancel}
      {...props}
    >
      <DialogTextField {...{ onChange, onKeyUp, value, fieldState }} testId="AI-name-input-dialog-text-field" />
    </BaseDialog>
  );
});

NameInputDialog.displayName = "NameInputDialog" as const;

export default NameInputDialog;
