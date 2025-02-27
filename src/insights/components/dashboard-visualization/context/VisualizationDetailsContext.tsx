import { createContext } from "react";
import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";
import { VisTypes } from "src/insights/redux/types/schemas/dashboardVisualizations";

export const VisualizationDetailsContext: React.Context<VisualizationDetails<VisTypes>> = createContext<
  VisualizationDetails<VisTypes>
>(null!);
