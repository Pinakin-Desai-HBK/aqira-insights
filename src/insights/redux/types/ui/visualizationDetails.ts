import { VisTypes } from "../schemas/dashboardVisualizations";
import { Workspace } from "../schemas/project";
import { FilteredVisualizationProperties } from "./dashboardVisualization";

export type VisualizationDetails<T extends VisTypes> = {
  id: string;
  name: string;
  properties: FilteredVisualizationProperties<T>;
  workspace: Workspace;
  minHeight: number;
  minWidth: number;
  type: T;
};
