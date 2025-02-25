import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePropertyUtils } from "./usePropertyUtils";
import { PropertyEnum } from "src/redux/types/schemas/properties";
import { PropertyParams } from "src/redux/types/ui/properties";

const PropertySelectField = (props: PropertyParams<PropertyEnum>) => {
  const theme = useTheme();
  const {
    property,
    propertyFieldProps: { validValues, disabled, name }
  } = props;
  const { updateProperty } = usePropertyUtils(props);
  const [fieldValue, setFieldValue] = useState<string | null>(null);
  const [startValue, setStartValue] = useState<string>();

  const firstValue = useMemo(() => (validValues ? validValues[0] : undefined), [validValues]);

  const handleChange = useCallback((event: SelectChangeEvent<string>) => {
    const {
      target: { value }
    } = event;
    setFieldValue(value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") setFieldValue(startValue!);
    },
    [startValue]
  );

  const handleBlur = useCallback(async () => {
    if (fieldValue && fieldValue !== startValue) {
      updateProperty(fieldValue);
    }
  }, [fieldValue, updateProperty, startValue]);

  useEffect(() => {
    if (!property) return;
    const { value, type } = property;
    if (type === "Enum" && (value === null || (validValues !== undefined && validValues?.includes(value)))) {
      setFieldValue(value);
      setStartValue(value!);
    }
  }, [property, validValues]);

  useEffect(() => {
    return () => {
      const elem = document.activeElement;
      if (elem && (!elem.id || !elem.id.startsWith(`AI-property-select-field-`))) {
        handleBlur();
      }
    };
  }, [handleBlur]);

  return property && validValues && firstValue ? (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <Select
        id={`AI-property-select-field-${name}`}
        disabled={disabled === true}
        onChange={handleChange}
        onBlur={handleBlur}
        value={fieldValue || firstValue}
        fullWidth
        size="small"
        sx={{ textAlign: "left" }}
        data-testid={`AI-property-select`}
      >
        {validValues.map((value) => (
          <MenuItem
            selected={value === fieldValue}
            key={value}
            value={value}
            sx={{ fontSize: "12px", color: theme.palette.properties.text }}
            data-testid={`AI-property-select-option-${value}`}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </div>
  ) : null;
};

export default PropertySelectField;
