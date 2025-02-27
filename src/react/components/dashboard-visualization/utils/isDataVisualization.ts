import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { VisTypes } from "src/react/redux/types/schemas/dashboardVisualizations";
import { DataVisTypes, VisZodSchemaMap } from "src/react/redux/types/ui/dashboardVisualization";

export const isDataVisualization = (
  details: VisualizationDetails<VisTypes> | null
): details is VisualizationDetails<DataVisTypes> => details !== null && details.type in VisZodSchemaMap;

export const isDataVisualizationByType = (type: string) => type in VisZodSchemaMap;
