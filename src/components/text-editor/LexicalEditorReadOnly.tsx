import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import EditorTheme from "./EditorTheme";
import "./LexicalEditor.css";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { CodeNode } from "@lexical/code";
import ContentRefreshPlugin from "./plugins/ContentRefreshPlugin";
import { setEditorState } from "./LexicalEditor";
import { TextNode } from "lexical";
import { ExtendedTextNode } from "./plugins/ExtendedTextNode";

interface RichTextPluginProps {
  data?: string | null | undefined;
  id?: string;
}
export default function RichTextEditorReadOnly({ data, id }: RichTextPluginProps) {
  const editorConfig: InitialConfigType = {
    namespace: "Aa",
    nodes: [
      ExtendedTextNode,
      { replace: TextNode, with: (node: TextNode) => new ExtendedTextNode(node.__text) },
      MarkNode,
      HeadingNode,
      QuoteNode,
      LinkNode,
      ListNode,
      ListItemNode,
      CodeNode
    ],
    editable: false,
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    editorState: (editor) => {
      setEditorState(editor, data ?? "");
    },
    // The editor theme
    theme: EditorTheme
  };

  return (
    <LexicalComposer key={"ReadOnly-Text-Editor-" + id} initialConfig={editorConfig}>
      <div className="editor-display-container ">
        <div className="editor-inner">
          <ContentRefreshPlugin data={data} />
        </div>
      </div>
    </LexicalComposer>
  );
}
