import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatStringListForAPI } from "../../../helpers/format-number/format-number";
import { styled } from "@mui/material/styles";
import TextareaAutosizeBase from "@mui/material/TextareaAutosize";
import { usePropertyUtils } from "./usePropertyUtils";
import { PropertyStringList } from "src/react/redux/types/schemas/properties";
import { PropertyParams } from "src/react/redux/types/ui/properties";

const PropertyTextAreaInputField = (props: PropertyParams<PropertyStringList>) => {
  const { propertyFieldProps, property, index } = props;
  const { name, disabled } = propertyFieldProps;
  const { updateProperty } = usePropertyUtils({ property, index, propertyFieldProps });

  const [startValue, setStartValue] = useState<string>();
  const [fieldValue, setFieldValue] = useState<string | number | readonly string[] | undefined>();
  const [errorMessage, setErrorMessage] = useState("");

  // Because  of the various triggers for the update (bkur, unmount, enter key)
  // we need to keep track of the last value set to prevent multiple updates
  const lastSet = useRef<unknown>(undefined);
  const [rows, setRows] = useState(1);

  useEffect(() => {
    if (!property) return;
    const { value } = property;
    const valueToSet = Array.isArray(value) ? value.join("\n") : "";
    setStartValue(valueToSet);
    setFieldValue(valueToSet);
    setRows(Array.isArray(value) ? value.length + 1 : 1);
  }, [property]);

  const handleBlur = useCallback(async () => {
    if (errorMessage || fieldValue === undefined || fieldValue === startValue) return;
    const valueToUpdate = fieldValue === null ? fieldValue : formatStringListForAPI(fieldValue);
    if (valueToUpdate === lastSet.current) return;
    lastSet.current = valueToUpdate;
    const result = await updateProperty(valueToUpdate);
    const resultValue = Array.isArray(result?.value) ? result.value.join("\n") : "";
    setStartValue(resultValue);
    setFieldValue(resultValue);
    setRows(Array.isArray(result?.value) ? result.value.length : 1);
  }, [errorMessage, fieldValue, startValue, updateProperty]);

  useEffect(() => {
    return () => {
      const elem = document.activeElement;
      if (!elem) return;
      if (elem.toString() !== "[object HTMLTextAreaElement]") handleBlur();
      if (!elem.id || elem.id !== `AI-property-text-area-${name}`) (elem as HTMLTextAreaElement).blur();
    };
  }, [handleBlur, name]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value: newValue }
    } = e;
    setErrorMessage(""); // Add any validation logic if needed
    setFieldValue(newValue);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFieldValue((prevValue) => (prevValue ? `${prevValue}\n` : "\n"));
      setRows((prevRows) => Math.min(prevRows + 1, 10)); // Ensure rows do not exceed 10
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        setFieldValue(startValue);
      }
    },
    [startValue]
  );

  return fieldValue !== undefined ? (
    <TextareaAutosize
      autoComplete="off"
      id={`AI-property-text-area-${name}`}
      minRows={rows}
      maxRows={10}
      disabled={disabled === true}
      data-testid={`AI-property-text-area`}
      value={fieldValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      spellCheck="false"
    />
  ) : null;
};

const TextareaAutosize = styled(TextareaAutosizeBase)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontSize: "12px",
  fontFamily: "inherit",
  width: "100%",
  padding: "5px",
  boxSizing: "border-box",
  margin: "2px 6px 1px",
  resize: "none",
  color: theme.palette.properties.text,
  background: theme.palette.properties.input,
  border: "1px solid rgb(196 196 196)",
  borderRadius: "4px",
  "&:hover": { border: "1px solid", borderColor: "#00457B", outline: "none" },
  "&:focus-visible": { border: "2px solid", borderColor: "#00457B", outline: "none", margin: "1px 5px 0" }
}));

export default PropertyTextAreaInputField;
