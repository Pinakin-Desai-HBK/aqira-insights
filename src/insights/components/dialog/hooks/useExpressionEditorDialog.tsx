import { useContext } from "react";
import { DialogContext } from "../context/DialogContext";
import { UpdateHandler } from "src/insights/redux/types/ui/properties";

export const useExpressionEditorDialog = ({
  value,
  identifier,
  title,
  updateHandler,
  showOverview
}: {
  value: string;
  updateHandler: UpdateHandler<string | null>;
  identifier: string;
  title: string;
  showOverview: boolean;
}) => {
  const { openDialog, closeDialog } = useContext(DialogContext);
  const openExpressionEditor = () => {
    if (value !== null)
      openDialog({
        name: "ExpressionEditorDialog",
        props: {
          title,
          expression: value,
          showOverview,
          message: "",
          identifier,
          onCancel: () => closeDialog(),
          onOk: (updatedValue: string | null) => {
            updateHandler(updatedValue || "");
            closeDialog();
          }
        }
      });
  };
  return { openExpressionEditor };
};
