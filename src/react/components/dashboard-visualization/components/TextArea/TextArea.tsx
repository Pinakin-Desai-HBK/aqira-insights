import RichTextEditorReadOnly from "../../../text-editor/LexicalEditorReadOnly";
import { TextAreaKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { VisualizationDetailsContext } from "../../context/VisualizationDetailsContext";
import { useContext } from "react";

export const TextArea = () => {
  const {
    properties: { text }
  } = useContext(VisualizationDetailsContext) as VisualizationDetails<TextAreaKey>;
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        pointerEvents: "auto"
      }}
    >
      <RichTextEditorReadOnly data={text} />
    </div>
  );
};
