import BaseDialog from "../support/BaseDialog";
import useFileBrowser from "../../file-browser/hooks/useFileBrowser";
import { useEffect } from "react";
import { DialogFileBrowser } from "../../file-browser/file-browser/DialogFileBrowser";
import { FileDialogParams } from "src/react/redux/types/ui/dialogs";

const FileDialog = (props: FileDialogParams) => {
  const { action, confirmButtonText, contentFileFilter, onCancel, onOk } = props;
  const fileBrowserProps = useFileBrowser(contentFileFilter);
  const { confirmButtonDisabled, handleConfirm, setCurrentAction, setOnClose, setOnConfirm } = fileBrowserProps;

  useEffect(() => setCurrentAction(action), [action, setCurrentAction]);
  useEffect(() => setOnClose(() => onCancel), [onCancel, setOnClose]);
  useEffect(() => setOnConfirm(() => onOk), [onOk, setOnConfirm]);

  return (
    <BaseDialog
      maxWidth="lg"
      contentSx={{ padding: "0" }}
      messageSx={{ paddingLeft: "16px", backgroundColor: "#F8F8F8" }}
      testidPrefix="AI-file-dialog"
      {...props}
      close={onCancel}
      buttons={[
        {
          callback: onCancel,
          label: "Cancel",
          disabled: false,
          testidSuffix: "cancel-button"
        },
        {
          callback: handleConfirm,
          label: confirmButtonText || "Confirm",
          disabled: confirmButtonDisabled,
          testidSuffix: "confirm-button"
        }
      ]}
    >
      <DialogFileBrowser {...{ ...props, ...fileBrowserProps, onOk, onCancel }} />
    </BaseDialog>
  );
};
FileDialog.displayName = "FileDialog" as const;

export default FileDialog;
