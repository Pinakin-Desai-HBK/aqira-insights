import "./WorkspaceCanvas.css";
import NetworkContentProvider from "./network/NetworkContentProvider";
import DashboardContentProvider from "./dashboard/DashboardContentProvider";
import { useAppDispatch, useAppSelector } from "src/redux/hooks/hooks";
import { selectStore_UI_Project_SelectedWorkspace } from "src/redux/slices/ui/project/projectSlice";
import { memo, useEffect } from "react";
import { uiWorkspace_reset, uiWorkspace_setSelectedWorkspaceItems } from "src/redux/slices/ui/workspace/workspaceSlice";

export const WorkspaceCanvas = memo(() => {
  const selectedWorkspace = useAppSelector(selectStore_UI_Project_SelectedWorkspace);

  const appDispatch = useAppDispatch();
  useEffect(() => {
    if (selectedWorkspace) appDispatch(uiWorkspace_reset(selectedWorkspace.id));
    return () => {
      if (selectedWorkspace) appDispatch(uiWorkspace_setSelectedWorkspaceItems([]));
    };
  }, [selectedWorkspace, appDispatch]);

  if (!selectedWorkspace) return null;
  const { type } = selectedWorkspace;
  if (type === "Network") {
    return <NetworkContentProvider workspace={selectedWorkspace} />;
  }
  if (type === "Dashboard") {
    return <DashboardContentProvider workspace={selectedWorkspace} />;
  }
  return null;
});
WorkspaceCanvas.displayName = "WorkspaceCanvas";
