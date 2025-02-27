import { ColumnDetailsDialogParams } from "src/react/redux/types/ui/dialogs";
import BaseDialog from "../support/BaseDialog";
import { ColumnDetailsDialogContent } from "src/react/components/column-details-dialog/ColumnDetailsDialogContent";

const ColumnDetailsDialog = (props: ColumnDetailsDialogParams) => {
  return (
    <BaseDialog
      contentSx={{
        padding: "0",
        height: "70vh",
        overflow: "hidden",
        paddingLeft: "8px",
        backgroundColor: "#f6f6f6",
        display: "flex",
        flexDirection: "column"
      }}
      messageSx={{ paddingLeft: "0" }}
      actionsSx={{ borderTop: "1px solid #A0A0A0" }}
      testidPrefix="AI-column-details-dialog"
      close={props.onOk}
      title={props.title}
      fullWidth={true}
      maxWidth="lg"
      buttons={[
        {
          callback: props.onOk,
          label: "OK",
          disabled: false,
          testidSuffix: "ok-button"
        }
      ]}
    >
      <ColumnDetailsDialogContent {...props} />
    </BaseDialog>
  );
};
ColumnDetailsDialog.displayName = "ColumnDetailsDialog" as const;

export default ColumnDetailsDialog;
