import BaseDialog from "../support/BaseDialog";
import RichTextEditor from "../../text-editor/LexicalEditor";
import { useState } from "react";
import { RichTextEditorDialogParams } from "src/redux/types/ui/dialogs";

const RichTextEditorDialog = (props: RichTextEditorDialogParams) => {
  const { richText, identifier, onCancel, onOk } = props;
  const [currentValue, setCurrentValue] = useState(richText);

  const handleEditorChange = (value: string | undefined) => {
    if (value != undefined) setCurrentValue(value);
  };

  return (
    <BaseDialog
      testidPrefix={`RichTextEditorDialog-${identifier}`}
      maxWidth="lg"
      buttons={[
        {
          callback: onCancel,
          label: "Cancel",
          disabled: false,
          testidSuffix: "CancelButton"
        },
        {
          callback: () => {
            onOk(currentValue || "");
          },
          label: "OK",
          disabled: false,
          testidSuffix: "ConfirmButton"
        }
      ]}
      contentSx={{ backgroundColor: "#E8E8E8", borderBottom: "1px solid #e0e0e0", padding: "0px" }}
      close={onCancel}
      {...props}
    >
      <RichTextEditor data={richText} onChange={handleEditorChange} />
    </BaseDialog>
  );
};
RichTextEditorDialog.displayName = "RichTextEditorDialog" as const;

export default RichTextEditorDialog;
