import { ReactFlowInstance, useReactFlow, useUpdateNodeInternals } from "reactflow";
import CenterFocusStrong from "@mui/icons-material/CenterFocusStrong";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import Lock from "@mui/icons-material/Lock";
import LockOpen from "@mui/icons-material/LockOpen";
import Box from "@mui/material/Box";
import { memo, useCallback } from "react";
import useDashboardVisualizations from "../useDashboardVisualizations";
import { ControlsFab } from "../../shared/ControlsFab";
import { useAppDispatch, useAppSelector } from "src/react/redux/hooks/hooks";
import { appLabels } from "src/react/consts/labels";
import {
  selectStore_UI_Workspace_Locked,
  uiWorkspace_setLocked
} from "src/react/redux/slices/ui/workspace/workspaceSlice";
import { TypedWorkspace } from "src/react/redux/types/redux/workspaces";

const labels = appLabels.DashboardCanvasCustomControls;

const DashboardCanvasCustomControls = memo(
  ({
    reactFlowInstance,
    workspace
  }: {
    reactFlowInstance: ReactFlowInstance | undefined;
    workspace: TypedWorkspace<"Dashboard">;
  }) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const locked = useAppSelector(selectStore_UI_Workspace_Locked);
    const appDispatch = useAppDispatch();
    const { visualizations } = useDashboardVisualizations(reactFlowInstance || null, workspace);
    const updateNodeInternals = useUpdateNodeInternals();
    const toggleLocked = useCallback(() => {
      appDispatch(uiWorkspace_setLocked(!locked));
      visualizations.forEach((visualization) => {
        updateNodeInternals(visualization.id);
      });
    }, [appDispatch, locked, visualizations, updateNodeInternals]);
    return (
      <Box
        data-testid="rf__buttonbar"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          justifyContent: "flex-end",
          margin: "20px",
          overflow: "hidden"
        }}
      >
        <ControlsFab testId="rf__buttonbar-zoomin" title={labels.zoomIn} onClick={zoomIn}>
          <ZoomIn />
        </ControlsFab>
        <ControlsFab testId="rf__buttonbar-fitview" title={labels.resetView} onClick={fitView}>
          <CenterFocusStrong />
        </ControlsFab>
        <ControlsFab testId="rf__buttonbar-zoomout" title={labels.zoomOut} onClick={zoomOut}>
          <ZoomOut />
        </ControlsFab>
        <div data-testid={"AI-dashboard-mode-button"}>
          {locked ? (
            <ControlsFab
              onClick={toggleLocked}
              testId={"AI-dashboard-edit-icon"}
              title={labels.locked}
              sx={{
                flexShrink: 0
              }}
            >
              <Lock sx={{ color: "white" }} />
            </ControlsFab>
          ) : (
            <ControlsFab
              onClick={toggleLocked}
              testId={"AI-dashboard-view-icon"}
              title={labels.unlocked}
              sx={{
                backgroundColor: "#237F7B",
                color: "white",
                "&:hover": { backgroundColor: "#136F6B" }
              }}
            >
              <LockOpen />
            </ControlsFab>
          )}
        </div>
      </Box>
    );
  }
);

DashboardCanvasCustomControls.displayName = "DashboardCanvasCustomControls";

export default DashboardCanvasCustomControls;
