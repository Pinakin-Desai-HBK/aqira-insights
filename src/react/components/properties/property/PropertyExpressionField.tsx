import Box from "@mui/material/Box";
import { usePropertyUtils } from "./usePropertyUtils";
import { useMemo } from "react";
import { Property } from "src/react/redux/types/schemas/properties";
import { PropertyParams } from "src/react/redux/types/ui/properties";

const lineCount = 3;

const PropertyExpressionField = (params: PropertyParams<Property>) => {
  const { openExpressionEditor } = usePropertyUtils(params);
  const { property, propertyFieldProps } = params;

  const isPython = useMemo(() => property && property.type === "Python", [property]);
  return property ? (
    <Box
      sx={{
        fontFamily: "system-ui",
        overflow: "hidden",
        display: "flex",
        flexGrow: "1",
        position: "relative",
        border: "1px solid rgb(196 196 196)",
        borderRadius: "4px",
        "&:hover": { borderColor: "#00457B", outline: "none" },
        "&:focus-visible": { border: "2px solid", borderColor: "#00457B", outline: "none", margin: "1px 5px 0" }
      }}
      data-testid={`AI-property-${isPython ? "python" : "expression"}-field-${propertyFieldProps.name}`}
    >
      <div
        style={{
          height: `${24 * lineCount}px`,
          overflow: "hidden",
          backgroundColor: "#FFF",
          color: "#47505C",
          flexGrow: "1",
          resize: "none",
          border: "0",
          fontFamily: `Consolas, "Courier New", monospace`,
          fontWeight: `normal`,
          fontSize: `12px`,
          fontFeatureSettings: `"liga" 0, "calt" 0`,
          fontVariationSettings: `normal`,
          lineHeight: `19px`,
          letterSpacing: `0px`,
          padding: `5px`,
          textAlign: `left`,
          wordBreak: "break-word",
          userSelect: "none",
          cursor: "pointer"
        }}
        data-testid={`AI-property-${isPython ? "python" : "expression"}-field-value-${propertyFieldProps.name}`}
        onClick={openExpressionEditor}
      >
        {isPython ? property.value : property.expression}
      </div>
    </Box>
  ) : null;
};

export default PropertyExpressionField;
