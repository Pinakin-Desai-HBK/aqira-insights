import Box from "@mui/material/Box";
import RichTextEditorReadOnly from "../../text-editor/LexicalEditorReadOnly";
import { usePropertyUtils } from "./usePropertyUtils";
import { PropertyRichText } from "src/react/redux/types/schemas/properties";
import { PropertyParams } from "src/react/redux/types/ui/properties";
const lineCount = 3;

const PropertyRichTextField = (params: PropertyParams<PropertyRichText>) => {
  const {
    property,
    propertyFieldProps: { name }
  } = params;
  const { openRichTextEditor } = usePropertyUtils(params);

  return property ? (
    <Box
      sx={{
        fontFamily: "system-ui",
        overflow: "hidden",
        display: "flex",
        flexGrow: "1",
        position: "relative",
        width: "max-content",
        border: "1px solid rgb(196 196 196)",
        borderRadius: "4px",
        "&:hover": { borderColor: "#00457B", outline: "none" },
        "&:focus-visible": { border: "2px solid", borderColor: "#00457B", outline: "none", margin: "1px 5px 0" }
      }}
      data-testid={`AI-property-richtext-field-${name}`}
    >
      <div
        style={{
          height: `${36 * lineCount}px`,
          whiteSpace: "pre",
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
          width: "max-content"
        }}
        data-testid={`AI-property-richtext-field-value-${name}`}
        onClick={openRichTextEditor}
      >
        <RichTextEditorReadOnly data={typeof property.value === "string" ? property.value : ""} />
      </div>
    </Box>
  ) : null;
};

export default PropertyRichTextField;
