import { useCallback, useEffect, useState } from "react";
import { usePropertyUtils } from "./usePropertyUtils";
import { PropertyBool } from "src/insights/redux/types/schemas/properties";
import { PropertyParams } from "src/insights/redux/types/ui/properties";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

const PropertySwitchField = (props: PropertyParams<PropertyBool>) => {
  const theme = useTheme();

  const { index, propertyFieldProps, property } = props;
  const { disabled } = propertyFieldProps;
  const { updateProperty } = usePropertyUtils({ index, property, propertyFieldProps });

  const [fieldValue, setFieldValue] = useState<boolean | null>();

  useEffect(() => {
    if (!property) return;
    const { value, type } = property;
    if (type === "Boolean") setFieldValue(value);
  }, [property]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setFieldValue(checked);
      updateProperty(checked);
    },
    [updateProperty]
  );

  return fieldValue !== undefined ? (
    <Box sx={{ height: "28px", display: "flex", alignItems: "center" }}>
      <Switch
        checked={!!fieldValue}
        disabled={disabled === true}
        data-testid={`AI-property-switch`}
        onChange={handleChange}
        sx={{
          width: 38,
          height: 18,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: "2px",
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(20px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.mode === "light" ? theme.palette.properties.switchOn : "#2ECA45",
                opacity: 1,
                border: 0
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5
              }
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "#33cf4d",
              border: "6px solid #fff"
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: theme.palette.mode === "light" ? 0.7 : 0.3
            }
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 14,
            height: 14
          },
          "& .MuiSwitch-track": {
            borderRadius: 18 / 2,
            backgroundColor: theme.palette.mode === "light" ? theme.palette.properties.switchOff : "#39393D",
            opacity: 1,
            transition: theme.transitions.create(["background-color"], {
              duration: 500
            })
          }
        }}
      ></Switch>
    </Box>
  ) : null;
};

export default PropertySwitchField;
