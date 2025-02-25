import TextField from "@mui/material/TextField";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatNumberForAPI, formatNumberForUI } from "../../../helpers/format-number/format-number";
import { validateNumber } from "../../../helpers/validate-number";
import { validateName } from "./validateName";
import { useWorkspaceItemNameValidator } from "../../workspace-canvas/hooks/useWorkspaceItemNameValidator";
import { usePropertyUtils } from "./usePropertyUtils";
import { Property, PropertyDouble, PropertyInteger } from "src/redux/types/schemas/properties";
import { PropertyInputProps, PropertyParams } from "src/redux/types/ui/properties";
import { selectStore_UI_Workspace_SelectedWorkspaceItem } from "src/redux/slices/ui/workspace/workspaceSlice";
import { useAppSelector } from "src/redux/hooks/hooks";

const isNumericType = (type: string): type is "Double" | "Integer" => type === "Double" || type === "Integer";

const isNumericProps = (
  obj: PropertyInputProps<Property>
): obj is (PropertyInteger | PropertyDouble) & PropertyParams<Property> => isNumericType(obj.type);

const PropertyInputField = (props: PropertyParams<Property>) => {
  const { index, property, propertyFieldProps } = props;
  const { name, type, disabled } = propertyFieldProps;
  const selectedWorkspaceItem = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItem);
  const { updateProperty } = usePropertyUtils({ propertyFieldProps, property, index });
  const [startValue, setStartValue] = useState<string>();
  const [fieldValue, setFieldValue] = useState<string>();
  const [errorMessage, setErrorMessage] = useState("");

  // Because  of the various triggers for the update (bkur, unmount, enter key)
  // we need to keep track of the last value set to prevent multiple updates
  const lastSet = useRef<unknown>(undefined);

  useEffect(() => {
    if (!property) return;
    const { value } = property;
    const valueToSet =
      value !== null ? (isNumericType(type) ? formatNumberForUI(value.toString()) : value.toString()) : "";
    setStartValue(valueToSet);
    setFieldValue(valueToSet);
  }, [property, type]);

  const handleBlur = useCallback(async () => {
    if (errorMessage || fieldValue === undefined || fieldValue === startValue) return;
    const valueToUpdate =
      fieldValue === null ? fieldValue : isNumericType(type) ? formatNumberForAPI(fieldValue, type) : fieldValue;
    if (valueToUpdate === lastSet.current) return;
    lastSet.current = valueToUpdate;
    const result = await updateProperty(valueToUpdate);

    const resultValue = result?.value ? result.value.toString() : "";
    const valueForField = isNumericType(type) ? formatNumberForUI(resultValue) : resultValue;
    setStartValue(valueForField);
    setFieldValue(valueForField);
  }, [errorMessage, fieldValue, startValue, type, updateProperty]);

  useEffect(() => {
    return () => {
      const elem = document.activeElement;
      if (!elem) return;
      if (elem.toString() !== "[object HTMLInputElement]") handleBlur();
      if (!elem.id || !elem.id.startsWith(`AI-property-`)) (elem as HTMLInputElement).blur();
    };
  }, [handleBlur, name]);

  const nameValidator = useWorkspaceItemNameValidator();

  const getErrorMessage = useCallback(
    (value: string) => {
      if (name === "Name") {
        return validateName(value, nameValidator, selectedWorkspaceItem ? selectedWorkspaceItem.id : null);
      }
      return isNumericProps(propertyFieldProps) ? validateNumber(value, propertyFieldProps) : "";
    },
    [name, nameValidator, propertyFieldProps, selectedWorkspaceItem]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value: newValue }
      } = e;
      setErrorMessage(getErrorMessage(newValue));
      setFieldValue(newValue);
    },
    [getErrorMessage]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      if (key === "Escape") {
        setFieldValue(startValue);
        setErrorMessage(getErrorMessage(startValue!));
      }
      if (key === "Enter") handleBlur();
    },
    [handleBlur, startValue, getErrorMessage]
  );

  return fieldValue !== undefined ? (
    <TextField
      autoComplete="off"
      fullWidth
      id={`AI-property-text-field-${name}`}
      variant="outlined"
      size="small"
      disabled={disabled === true}
      sx={{
        "& fieldset": { border: disabled === true ? "none" : "1px solid", borderColor: "rgb(196 196 196)" },
        "& .MuiFormHelperText-root": { margin: "2px 6px 0", fontSize: "10px" }
      }}
      data-testid={`AI-property-text-field`}
      value={fieldValue}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      error={!!errorMessage}
      helperText={errorMessage}
    />
  ) : null;
};

export default PropertyInputField;
