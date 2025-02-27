import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";
import { VisTypes } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { DataVisTypes, VisZodSchemaMap } from "src/insights/redux/types/ui/dashboardVisualization";

export const isDataVisualization = (
  details: VisualizationDetails<VisTypes> | null
): details is VisualizationDetails<DataVisTypes> => details !== null && details.type in VisZodSchemaMap;

export const isDataVisualizationByType = (type: string) => type in VisZodSchemaMap;
