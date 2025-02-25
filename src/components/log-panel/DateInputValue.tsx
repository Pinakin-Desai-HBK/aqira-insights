import { GridFilterInputValueProps } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { DateTimeField, DateTimeValidationError } from "@mui/x-date-pickers";
import { Ref, useRef } from "react";
import { FieldChangeHandler } from "@mui/x-date-pickers/internals";

export const DateInputValue = (props: GridFilterInputValueProps) => {
  const { item, applyValue } = props;
  const dateRef: Ref<HTMLDivElement> = useRef(null);
  const handleFilterChange: FieldChangeHandler<number | null, DateTimeValidationError> = (value) => {
    applyValue({ ...item, value: value ? dayjs(value) : null });
  };
  return (
    <DateTimeField
      label="Date/time"
      variant="standard"
      size="small"
      sx={{ mt: "auto" }}
      format="YYYY/MM/DD HH:mm:ss"
      spellCheck={false}
      onChange={handleFilterChange}
      ref={dateRef}
      value={item.value && item.value.isValid() ? item.value : null}
    />
  );
};
