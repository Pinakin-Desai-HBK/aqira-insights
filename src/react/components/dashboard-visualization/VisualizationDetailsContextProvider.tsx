import { useDashboardToolbarContext } from "./toolbar/context/useToolbarContext";
import { NodeProps } from "reactflow";
import { NodeToolbarContext } from "./toolbar/context/ToolbarContext";
import { useAppSelector } from "src/react/redux/hooks/hooks";
import { selectStore_UI_Workspace_Locked } from "src/react/redux/slices/ui/workspace/workspaceSlice";
import { DashboardVisualizationDataUI } from "src/react/redux/types/ui/dashboardVisualization";
import { RenderDashboardVisualization } from "./RenderDashboardVisualization";
import { VisualizationDetailsContext } from "./context/VisualizationDetailsContext";
import { useVisualizationDetailsContext } from "./context/useVisualizationDetailsContext";
import { memo } from "react";
import { showHistogram2D, showHistogram3D } from "./temp";

export const VisualizationDetailsContextProvider = memo((props: NodeProps<DashboardVisualizationDataUI>) => {
  const locked = useAppSelector(selectStore_UI_Workspace_Locked);
  const { data } = props;
  const { type } = data;
  const { details } = useVisualizationDetailsContext(data);
  const visualizationToolbarContextData = useDashboardToolbarContext(
    "DashboardCanvas",
    locked ? "ViewModeNode" : "EditModeNode",
    showHistogram3D(data) ? "Histogram3D" : showHistogram2D(data) ? "Histogram" : type
  );

  if (!details) {
    return null;
  }
  return visualizationToolbarContextData ? (
    <VisualizationDetailsContext.Provider value={details}>
      <NodeToolbarContext.Provider value={visualizationToolbarContextData}>
        <RenderDashboardVisualization {...props} />
      </NodeToolbarContext.Provider>
    </VisualizationDetailsContext.Provider>
  ) : (
    <VisualizationDetailsContext.Provider value={details}>
      <RenderDashboardVisualization {...props} />
    </VisualizationDetailsContext.Provider>
  );
});
VisualizationDetailsContextProvider.displayName = "VisualizationDetailsContextProvider";
