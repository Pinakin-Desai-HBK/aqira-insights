import PropertySwitchField from "./PropertySwitchField";
import PropertyInputField from "./PropertyInputField";
import PropertyTextAreaInputField from "./PropertyTextAreaInputField";
import PropertySelectField from "./PropertySelectField";
import { memo, useMemo } from "react";
import PropertyExpressionField from "./PropertyExpressionField";
import PropertyRichTextField from "./PropertyRichTextField";
import PropertyComponent from "./PropertyComponent";
import { Property } from "src/react/redux/types/schemas/properties";
import { PropertyParams } from "src/react/redux/types/ui/properties";

const RenderProperty = memo((params: PropertyParams<Property>) => {
  const { propertyFieldProps, index, property } = params;
  const isExpression = propertyFieldProps.supportsExpression && property.setting === "Expression";
  const key = useMemo(() => `${propertyFieldProps?.name}-${index}`, [index, propertyFieldProps]);
  return propertyFieldProps ? (
    <PropertyComponent {...{ ...params, isExpression }}>
      {isExpression ? (
        <PropertyExpressionField key={key} {...params} />
      ) : (
        (() => {
          switch (propertyFieldProps.type) {
            case "Python":
              return <PropertyExpressionField key={key} {...params} />;
            case "Bool":
              return <PropertySwitchField key={key} {...{ propertyFieldProps, index, property }} />;
            case "Integer":
            case "Double":
            case "String":
              return <PropertyInputField key={key} {...params} />;
            case "Enum":
              return <PropertySelectField key={key} {...{ propertyFieldProps, index, property }} />;
            case "RichText":
              return <PropertyRichTextField key={key} {...{ propertyFieldProps, index, property }} />;
            case "StringList":
              return <PropertyTextAreaInputField key={key} {...{ propertyFieldProps, index, property }} />;
            default:
              return <></>;
          }
        })()
      )}
    </PropertyComponent>
  ) : null;
});
RenderProperty.displayName = "RenderProperty";

export default RenderProperty;
