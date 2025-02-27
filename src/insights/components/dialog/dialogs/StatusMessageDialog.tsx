import { StatusMessageDialogParams } from "src/insights/redux/types/ui/dialogs";
import BaseDialog from "../support/BaseDialog";

const StatusMessageDialog = (props: StatusMessageDialogParams) => (
  <BaseDialog testidPrefix="AI-status-message-dialog" {...props} />
);
StatusMessageDialog.displayName = "StatusMessageDialog" as const;

export default StatusMessageDialog;
