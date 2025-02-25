import { VisTypes } from "src/redux/types/schemas/dashboardVisualizations";
import { WorkspaceItemProperties } from "src/redux/types/schemas/workspace-item";
import { RawVisualizationProperties, VisPropertiesMap } from "src/redux/types/ui/dashboardVisualization";

export const filterProperties = <T extends VisTypes>(properties: WorkspaceItemProperties, type: VisTypes) => {
  const preparedProperties = Object.keys(properties).reduce((obj, key) => {
    const current = properties[key];
    return current !== undefined ? { ...obj, [key.toLowerCase()]: current.value } : obj;
  }, {});
  const filteredProperties: RawVisualizationProperties<T> = VisPropertiesMap[type].parse({
    ...preparedProperties,
    type
  });
  return filteredProperties;
};
