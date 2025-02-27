import BaseDialog from "../support/BaseDialog";
import Editor from "@monaco-editor/react";
import { useState } from "react";

/**
 * Added below (and changes in vite.config.ts) to prevent Monaco editor from downloading depenedencies from CDN
 */
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { ExpressionEditorDialogParams } from "src/insights/redux/types/ui/dialogs";
loader.config({ monaco });
loader.init().then(/* ... */);
/*
 * End of added code
 */

const ExpressionEditorDialog = (props: ExpressionEditorDialogParams) => {
  const { expression, identifier, onCancel, onOk, showOverview } = props;
  const [currentValue, setCurrentValue] = useState(expression);

  const handleEditorChange = (value: string | undefined) => {
    if (value != undefined) setCurrentValue(value);
  };

  return (
    <BaseDialog
      testidPrefix={`ExpressionEditorDialog-${identifier}`}
      maxWidth="lg"
      buttons={[
        {
          callback: onCancel,
          label: "Cancel",
          disabled: false,
          testidSuffix: "CancelButton"
        },
        {
          callback: () => onOk(currentValue),
          label: "OK",
          disabled: false,
          testidSuffix: "ConfirmButton"
        }
      ]}
      contentSx={{ padding: 0, borderBottom: "1px solid #e0e0e0", backgroundColor: "#E8E8E8" }}
      close={onCancel}
      {...props}
    >
      <div style={{ padding: "10px" }}>
        <Editor
          height="70vh"
          width="100%"
          options={{ minimap: { enabled: showOverview } }}
          defaultLanguage="python"
          language="python"
          defaultValue={expression}
          theme="vs-light"
          onChange={handleEditorChange}
          data-testid={"AI-CodeEditor"}
          className="ExpressionEditor"
        />
      </div>
    </BaseDialog>
  );
};
ExpressionEditorDialog.displayName = "ExpressionEditorDialog" as const;

export default ExpressionEditorDialog;
