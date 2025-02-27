import { VisConfigMap } from "src/react/redux/types/ui/dashboardVisualization";
import { VisualizationDetailsContext } from "./context/VisualizationDetailsContext";
import { useContext } from "react";

export const MappedDashboardVisualization = () => {
  const details = useContext(VisualizationDetailsContext);
  return VisConfigMap[details.type].component();
};
