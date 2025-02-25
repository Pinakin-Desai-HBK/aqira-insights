import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import Select from "@mui/material/Select";
import { $isTableNode, $isTableSelection } from "@lexical/table";
import ColorPicker from "./ColorPicker";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormControl from "@mui/material/FormControl";
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_MAP } from "@lexical/code";
import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType
} from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode
} from "@lexical/list";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  LexicalEditor,
  $isRootOrShadowRoot,
  ElementFormatType,
  NodeKey,
  $isElementNode
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { MenuItem } from "@mui/material";
import { ElementNode, RangeSelection, TextNode } from "lexical";
import { DropdownColorPickerProps } from "src/redux/types/ui/textEditor";
import { JSX } from "react";

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export const rootTypeToRootName = {
  root: "Root",
  table: "Table"
};

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote"
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [, setFontSize] = useState<string>("15px");
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>("root");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [, setBgColor] = useState<string>("#fff");
  const [, setFontFamily] = useState<string>("Arial");
  const [, setElementFormat] = useState<ElementFormatType>("left");
  const [, setIsLink] = useState(false);
  const [, setIsSubscript] = useState(false);
  const [, setIsSuperscript] = useState(false);
  const [, setIsCode] = useState(false);
  const [, setIsRTL] = useState(false);
  const [, setCodeLanguage] = useState<string>("");

  const [, setSelectedElementKey] = useState<NodeKey | null>(null);
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType("table");
      } else {
        setRootType("root");
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : "");
            return;
          }
        }
      }
      // Handle buttons
      setFontColor($getSelectionStyleValueForProperty(selection, "color", "#000"));
      setBgColor($getSelectionStyleValueForProperty(selection, "background-color", "#fff"));
      setFontFamily($getSelectionStyleValueForProperty(selection, "font-family", "Arial"));
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left"
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setFontSize($getSelectionStyleValueForProperty(selection, "font-size", "15px"));
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      editor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: "historic" } : {}
      );
    },
    [editor]
  );

  function BlockFormatDropDown({
    editor,
    blockType,
    disabled = false
  }: {
    blockType: keyof typeof blockTypeToBlockName;
    rootType: keyof typeof rootTypeToRootName;
    editor: LexicalEditor;
    disabled?: boolean;
  }): JSX.Element {
    const formatParagraph = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    };

    const formatHeading = (headingSize: HeadingTagType) => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        });
      }
    };

    const formatBulletList = () => {
      if (blockType !== "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    const formatCheckList = () => {
      if (blockType !== "check") {
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    const formatNumberedList = () => {
      if (blockType !== "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    const formatQuote = () => {
      if (blockType !== "quote") {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createQuoteNode());
        });
      }
    };

    const formatCode = () => {
      if (blockType !== "code") {
        editor.update(() => {
          let selection = $getSelection();

          if (selection !== null) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertRawText(textContent);
              }
            }
          }
        });
      }
    };

    return (
      <FormControl variant="standard" sx={{ m: 1 }}>
        <Select
          disableUnderline={true}
          labelId="format-select"
          id="format-select"
          value={blockType}
          label="Formatting options for text style"
          onChange={(event) => {
            const newBlockType = event.target.value;
            switch (newBlockType) {
              case "paragraph":
                formatParagraph();
                break;
              case "h1":
                formatHeading("h1");
                break;
              case "h2":
                formatHeading("h2");
                break;
              case "h3":
                formatHeading("h3");
                break;
              case "bullet":
                formatBulletList();
                break;
              case "number":
                formatNumberedList();
                break;
              case "check":
                formatCheckList();
                break;
              case "quote":
                formatQuote();
                break;
              case "code":
                formatCode();
                break;
              default:
                break;
            }
          }}
          disabled={disabled}
        >
          <MenuItem value="paragraph">Paragraph</MenuItem>
          <MenuItem value="h1">Heading 1</MenuItem>
          <MenuItem value="h2">Heading 2</MenuItem>
          <MenuItem value="h3">Heading 3</MenuItem>
          <MenuItem value="bullet">Bullet List</MenuItem>
          <MenuItem value="number">Numbered List</MenuItem>
          <MenuItem value="check">Check List</MenuItem>
          <MenuItem value="quote">Quote</MenuItem>
          <MenuItem value="code">Code Block</MenuItem>
        </Select>
      </FormControl>
    );
  }
  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );
  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <UndoIcon />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <RedoIcon />
      </button>
      <Divider />
      {blockType in blockTypeToBlockName && editor === editor && (
        <>
          <BlockFormatDropDown
            // disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <FormatBoldIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <FormatItalicIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <FormatUnderlinedIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <FormatStrikethroughIcon />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <FormatAlignLeftIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <FormatAlignCenterIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <FormatAlignRightIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <FormatAlignJustifyIcon />
      </button>{" "}
      <Divider />
      <button className="toolbar-item" aria-label="Justify Align">
        <DropdownColorPicker
          buttonClassName="toolbar-item color-picker"
          buttonAriaLabel="Formatting text color"
          buttonIconClassName="icon font-color"
          color={fontColor}
          onChange={onFontColorSelect}
          title="text color"
        />
      </button>
    </div>
  );
}

function DropdownColorPicker({ color, onChange }: DropdownColorPickerProps) {
  return (
    <Select
      variant="standard"
      id="text-editor-color-picker"
      labelId="text-editor-color-picker-label"
      defaultValue={1}
      inputProps={{ IconComponent: () => null }}
      disableUnderline={true}
      style={{ padding: "0px !important" }}
      sx={{
        ".MuiInput-input": {
          padding: "0px !important",
          cursor: "pointer",
          backgroundColor: "transparent",
          justifyContent: "center",
          display: "flex"
        }
      }}
    >
      <MenuItem value="1">
        <FormatColorTextIcon />
      </MenuItem>
      <ColorPicker color={color} onChange={onChange as (value: string, skipHistoryStack: boolean) => void} />
    </Select>
  );
}
