import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useRef } from "react";
import { DialogCheckboxProps } from "src/redux/types/ui/dialogs";

const DialogCheckbox = memo(({ checked, label, onChange, testId }: DialogCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, [ref]);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Checkbox
        onChange={onChange}
        checked={checked}
        data-testid={testId}
        size="small"
        sx={{
          minHeight: "50px",
          "& fieldset": { border: "initial" },
          "& .MuiFormHelperText-root": { margin: "2px 6px 0", fontSize: "10px" }
        }}
        inputRef={ref}
        autoFocus={true}
      />
      <Typography sx={{ alignContent: "center" }}>{label}</Typography>
    </div>
  );
});
DialogCheckbox.displayName = "DialogCheckbox";

export default DialogCheckbox;
