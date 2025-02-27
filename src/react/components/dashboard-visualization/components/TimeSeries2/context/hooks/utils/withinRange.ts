import { Range } from "src/react/redux/types/ui/dashboardVisualization";

export const withinRange = (value: number, range: Range) => {
  return value >= range.min && value <= range.max;
};
