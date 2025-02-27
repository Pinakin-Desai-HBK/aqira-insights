import { useCallback } from "react";
import { useAppDispatch } from "src/insights/redux/hooks/hooks";
import {
  selectStore_UI_Project_WorkspaceList,
  uiProject_reorderWorkspace
} from "src/insights/redux/slices/ui/project/projectSlice";
import { store } from "src/insights/redux/store";
import { DropResult } from "@hello-pangea/dnd";
import { useUpdateWorkspaceIndexMutation } from "src/insights/redux/api/appApi";

export const useHandleTabMoved = () => {
  const [updateWorkspaceIndex] = useUpdateWorkspaceIndexMutation();
  const appDispatch = useAppDispatch();

  const handleTabMoved = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const {
        source: { index: source },
        destination: { index: destination }
      } = result;

      // Reorder the project items in the redux store
      appDispatch(uiProject_reorderWorkspace({ source, destination }));

      // Get the updated project items from the redux store
      const newWorkspaces = selectStore_UI_Project_WorkspaceList(store.getState());

      // Update the index of affected project items in the database
      newWorkspaces.forEach(
        (workspace, index) =>
          index >= Math.min(source, destination) &&
          index <= Math.max(source, destination) &&
          updateWorkspaceIndex({ id: workspace.id, newIndex: index })
      );
    },
    [appDispatch, updateWorkspaceIndex]
  );

  return handleTabMoved;
};
