import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import EditorTheme from "./EditorTheme";
import "./LexicalEditor.css";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { CodeNode } from "@lexical/code";
import { useRef } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, EditorState, LexicalEditor, TextNode } from "lexical";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { ExtendedTextNode } from "./plugins/ExtendedTextNode";

interface RichTextPluginProps {
  data?: string | null | undefined;
  onChange?: (value: string) => void;
}

const setHTML = (editor: LexicalEditor, value: string, clear: boolean) => {
  try {
    const root = $getRoot();
    if (!root) return false;

    const parser = new DOMParser();
    const dom = parser.parseFromString(value, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);
    if (clear) {
      root.clear();
    }
    root.append(...nodes);
  } catch {
    return false;
  }
  return true;
};

export const setEditorState = (editor: LexicalEditor, value: string) => {
  if (value) {
    if (value.startsWith("{")) editor.setEditorState(editor.parseEditorState(value));
    else setHTML(editor, value ?? "", true);
    return;
  }
  const newState = editor.parseEditorState(
    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
  );
  editor.setEditorState(newState);
};

export default function RichTextEditor({ data, onChange }: RichTextPluginProps) {
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
    onError(error: Error) {
      throw error;
    },
    editorState: (editor) => {
      setEditorState(editor, data ?? "");
    },
    theme: EditorTheme
  };

  const editorStateRef = useRef<EditorState | undefined>(undefined);
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorStateRef.current = editorState;
              editor.update(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                if (onChange) {
                  onChange(htmlString);
                }
              });
            }}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}
