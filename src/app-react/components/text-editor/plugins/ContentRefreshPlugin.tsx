import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CLEAR_HISTORY_COMMAND } from "lexical";
import { useEffect } from "react";
import { setEditorState } from "../LexicalEditor";

function Placeholder() {
  return (
    <div className="editor-placeholder">
      <div style={{ fontSize: "22.5px", fontWeight: "800" }}>Text Area</div>
    </div>
  );
}

interface RichTextPluginProps {
  data?: string | null | undefined;
}

const ContentRefreshPlugin = ({ data }: RichTextPluginProps) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (editor) {
      editor.update(() => {
        setEditorState(editor, data ?? "");
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      });
    }
  }, [editor, data]);

  return (
    <RichTextPlugin
      contentEditable={<ContentEditable className="editor-input" />}
      placeholder={<Placeholder />}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};
export default ContentRefreshPlugin;
