import { createContext } from "react";
import { VisualizationDetails } from "src/redux/types/ui/visualizationDetails";
import { VisTypes } from "src/redux/types/schemas/dashboardVisualizations";

export const VisualizationDetailsContext: React.Context<VisualizationDetails<VisTypes>> = createContext<
  VisualizationDetails<VisTypes>
>(null!);
