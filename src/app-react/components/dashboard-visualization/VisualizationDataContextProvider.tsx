import { VisualizationDataContext } from "./context/VisualizationDataContext";
import { useVisualizationDataContext } from "./context/useVisualizationDataContext";
import { memo } from "react";
import { MappedDashboardVisualization } from "./MappedDashboardVisualization";

export const VisualizationDataContextProvider = memo(() => {
  const visualizationDataContextData = useVisualizationDataContext();
  return (
    <VisualizationDataContext.Provider value={visualizationDataContextData}>
      <MappedDashboardVisualization />
    </VisualizationDataContext.Provider>
  );
});
VisualizationDataContextProvider.displayName = "VisualizationDataContextProvider";
