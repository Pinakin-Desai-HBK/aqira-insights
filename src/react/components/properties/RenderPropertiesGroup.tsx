import { Property } from "src/react/redux/types/schemas/properties";
import { WorkspaceItemProperties } from "src/react/redux/types/schemas/workspace-item";
import RenderProperty from "./property/RenderProperty";

export const RenderPropertiesGroup = (props: {
  propertyDataArray: Property[];
  properties: WorkspaceItemProperties;
}) => {
  const { propertyDataArray, properties } = props;
  return propertyDataArray.map((propertyFieldProps, index) => {
    const property = properties ? properties[propertyFieldProps.name] : null;
    const key = propertyFieldProps.name + index;
    return property ? (
      <RenderProperty key={key} index={index} propertyFieldProps={propertyFieldProps} property={property} />
    ) : (
      <span key={key} />
    );
  });
};
