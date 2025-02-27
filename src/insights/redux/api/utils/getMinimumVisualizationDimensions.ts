import { DashboardVisualizationMinimumDimensions } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { PropertyInteger, PropertyGroupData } from "src/insights/redux/types/schemas/properties";

export const getMinimumVisualizationDimensions = (
  propertyGroups: PropertyGroupData[]
): DashboardVisualizationMinimumDimensions => {
  const minimimuDimensions: DashboardVisualizationMinimumDimensions = { minWidth: 0, minHeight: 0 };

  for (const propertyGroup of propertyGroups) {
    if (propertyGroup.name === "Position and size") {
      propertyGroup.properties.forEach((property) => {
        if (property.name === "Width") minimimuDimensions.minWidth = (property as PropertyInteger).lowerLimit!;
        if (property.name === "Height") minimimuDimensions.minHeight = (property as PropertyInteger).lowerLimit!;
      });
      break;
    }
  }

  return minimimuDimensions;
};
