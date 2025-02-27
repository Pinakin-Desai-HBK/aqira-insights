import TextField from "@mui/material/TextField";
import { memo, useEffect, useRef } from "react";
import { DialogTextFieldProps } from "src/insights/redux/types/ui/dialogs";

const DialogTextField = memo(({ value, fieldState, onKeyUp, onChange, testId }: DialogTextFieldProps) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, [ref]);
  return (
    <TextField
      onChange={onChange}
      onKeyUp={onKeyUp}
      {...fieldState}
      data-testid={testId}
      fullWidth
      variant="standard"
      size="small"
      placeholder={value}
      sx={{
        minHeight: "50px",
        "& fieldset": { border: "initial" },
        "& .MuiFormHelperText-root": { margin: "2px 6px 0", fontSize: "10px" }
      }}
      inputRef={ref}
      autoFocus={true}
    />
  );
});
DialogTextField.displayName = "DialogTextField";

export default DialogTextField;
