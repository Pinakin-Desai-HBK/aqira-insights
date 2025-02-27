import { createContext } from "react";
import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { VisTypes } from "src/react/redux/types/schemas/dashboardVisualizations";

export const VisualizationDetailsContext: React.Context<VisualizationDetails<VisTypes>> = createContext<
  VisualizationDetails<VisTypes>
>(null!);
