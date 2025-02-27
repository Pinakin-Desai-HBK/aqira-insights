import { NodeGroupColor, PaletteGroupData, VisualizationGroupColor } from "src/insights/redux/types/ui/palette";
import { NodePaletteGroupData, VisualizationPaletteGroupData } from "../../types/schemas/palette";

export const mapNodes = ({ nodes, group }: NodePaletteGroupData): PaletteGroupData => {
  const color = NodeGroupColor[group] ?? "#FF0000";
  return {
    groupName: group,
    items: nodes.map(({ type, icon, description, name }) => ({
      color,
      description,
      icon,
      type,
      name,
      properties: null
    }))
  };
};

export const mapVisualizations = ({ visualizations, group }: VisualizationPaletteGroupData): PaletteGroupData => {
  const color = VisualizationGroupColor[group] ?? "#FF0000";
  return {
    groupName: group,
    items: visualizations.map(({ type, icon, description, name }) => ({
      color,
      description,
      icon,
      type,
      name,
      properties: null
    }))
  };
};
