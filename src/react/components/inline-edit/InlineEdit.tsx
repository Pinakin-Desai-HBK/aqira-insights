import { ChangeEvent, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { useLongPress } from "use-long-press";
import { getCanvasFont, getTextWidth } from "./text-utils";
import { InlineEditProps, InlineEditState } from "src/react/redux/types/ui/inlineEdit";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";

export const InlineEdit = memo((props: InlineEditProps) => {
  const {
    setEditing,
    value: propsValue,
    onUpdate,
    validator,
    onCancel,
    editing,
    className,
    dataTestId,
    textColor,
    blockStart,
    sx,
    maxWidth
  } = props;
  const [state, setState] = useState<InlineEditState>({
    value: "",
    error: false,
    errorMessage: "",
    startValue: undefined
  });

  const [canvasFont, setCanvasFont] = useState<string | null>(null);

  const ref = useRef<HTMLSpanElement | null>(null);
  const [inputWidth, setInputWidth] = useState(30);

  const setWidth = useCallback(
    (value: string, canvasFont: string | null) => {
      let width = 15;
      const fontSize = canvasFont ? getTextWidth(value, canvasFont) : undefined;

      if (fontSize && fontSize > 15) {
        width = fontSize + 2;
      }
      if (maxWidth !== undefined && width > maxWidth) {
        width = maxWidth;
      }
      setInputWidth(width);
    },
    [maxWidth]
  );

  useEffect(() => {
    if (state.startValue !== propsValue && !editing) {
      setState({
        startValue: propsValue,
        error: false,
        value: propsValue,
        errorMessage: ""
      });
    }
  }, [editing, propsValue, state.startValue]);

  useEffect(() => {
    if (ref.current) {
      const font = getCanvasFont(ref.current);
      setCanvasFont(font);
      setWidth(state.value, font);
    }
    setWidth(state.value, canvasFont);
  }, [canvasFont, setWidth, state]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const result = validator(value);
      const { valid } = result;
      setState({
        ...state,
        error: valid ? false : true,
        value: value,
        errorMessage: valid ? "" : result.errorMessage
      });
      setWidth(value, canvasFont);
    },
    [validator, setWidth, canvasFont, state]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !state.error) {
        onUpdate(state.value);
        setTimeout(() => {
          setEditing(false);
        }, 0);
      }
      if (e.key === "Escape") {
        setEditing(false);
        setState({
          error: false,
          value: propsValue,
          errorMessage: "",
          startValue: propsValue
        });
        if (onCancel) {
          onCancel();
        }
      }
    },
    [onCancel, onUpdate, propsValue, setEditing, state]
  );

  const onBlur = useCallback(() => {
    if (editing) {
      setEditing(false);
      setState({
        error: false,
        value: propsValue,
        errorMessage: "",
        startValue: propsValue
      });
    }
  }, [editing, propsValue, setEditing]);

  const inputRef = useRef<HTMLDivElement | null>(null);

  const bindLongPress = useLongPress(
    () => {
      setEditing(true);
    },
    {
      threshold: 750,
      onStart: (e) => {
        if (blockStart) {
          e.nativeEvent.stopPropagation();
          e.nativeEvent.preventDefault();
        }
      },
      onFinish: (e) => {
        e.nativeEvent.stopPropagation();
        e.nativeEvent.preventDefault();
      },
      captureEvent: true
    }
  );

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Shift") {
      e.stopPropagation();
    }
  }, []);

  return editing ? (
    <span style={{ position: "relative" }}>
      <Tooltip
        title={"Press Enter to confirm or Escape to cancel"}
        placement="top"
        hidden={state.error ? true : undefined}
      >
        <TextField
          spellCheck={false}
          slotProps={{ htmlInput: { "data-testid": "AI-inline-edit-input" } }}
          ref={inputRef}
          inputRef={(input) => input && input.focus()}
          onChange={onChange}
          //onLostPointerCapture={onBlur}
          value={state.value}
          focused={true}
          variant="standard"
          size="small"
          placeholder={propsValue}
          sx={{
            width: `${inputWidth + 1}px`,
            marginBottom: "-3px",
            "& fieldset": { border: "initial" },
            "& .MuiInput-input": { color: textColor },
            "& .MuiFormHelperText-root": { margin: "2px 6px 0", fontSize: "10px" },
            ...sx
          }}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </Tooltip>
      <Popper open={state.error} anchorEl={inputRef.current}>
        <span
          data-testid="AI-inline-edit-error"
          style={{
            color: "#F00",
            marginLeft: "5px",
            fontSize: "12px",
            fontWeight: "500",
            padding: "10px",
            borderRadius: "3px",
            border: "1px solid black",
            backgroundColor: "white"
          }}
        >
          {state.errorMessage}
        </span>
      </Popper>
    </span>
  ) : (
    <span
      className={className}
      data-testid={dataTestId}
      ref={ref}
      {...bindLongPress()}
      onDoubleClick={() => setEditing(true)}
      style={{ paddingRight: "1px" }}
    >
      {state.value}
    </span>
  );
});
InlineEdit.displayName = "InlineEdit";
