import { createContext } from "react";
import { DataVisTypes, VisualizationDataContextData } from "src/insights/redux/types/ui/dashboardVisualization";

export const VisualizationDataContext = createContext<VisualizationDataContextData<DataVisTypes>>(null!);
