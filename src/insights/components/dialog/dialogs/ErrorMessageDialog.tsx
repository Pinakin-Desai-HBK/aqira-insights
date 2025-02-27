import BaseDialog from "../support/BaseDialog";
import { ErrorMessageDialogParams } from "src/insights/redux/types/ui/dialogs";

const ErrorMessageDialog = (props: ErrorMessageDialogParams) => {
  const { error } = props;

  return (
    <BaseDialog
      testidPrefix="AI-error-message-dialog"
      {...props}
      messageParts={error.errorsArray || []}
      close={props.onOk}
      buttons={[
        {
          callback: props.onOk,
          label: props.okLabel || "OK",
          disabled: false,
          testidSuffix: "ok-button"
        }
      ]}
    />
  );
};
ErrorMessageDialog.displayName = "ErrorMessageDialog" as const;

export default ErrorMessageDialog;
