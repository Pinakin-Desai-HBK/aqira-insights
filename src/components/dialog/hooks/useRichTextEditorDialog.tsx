import { useContext } from "react";
import { DialogContext } from "../context/DialogContext";
import { UpdateHandler } from "src/redux/types/ui/properties";

export const useRichTextEditorDialog = (
  richTextEditorValue: string | null,
  updateRichText: UpdateHandler<string | null>,
  identifier: string
) => {
  const { openDialog, closeDialog } = useContext(DialogContext);
  const openRichTextEditor = () => {
    if (updateRichText && richTextEditorValue !== null)
      openDialog({
        name: "RichTextEditorDialog",
        props: {
          title: "Edit Text",
          richText: richTextEditorValue,
          message: "",
          identifier,
          onCancel: () => closeDialog(),
          onOk: (expr: string | null) => {
            if (updateRichText) updateRichText(expr || "");
            closeDialog();
          }
        }
      });
  };
  return { openRichTextEditor };
};
