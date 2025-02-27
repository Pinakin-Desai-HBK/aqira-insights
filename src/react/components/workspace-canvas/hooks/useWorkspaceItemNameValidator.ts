import { skipToken } from "@reduxjs/toolkit/query";
import { useGetWorkspaceItemsQuery } from "src/react/redux/api/appApi";
import { useAppSelector } from "src/react/redux/hooks/hooks";
import { selectStore_UI_Project_SelectedWorkspace } from "src/react/redux/slices/ui/project/projectSlice";
import { selectStore_UI_Workspace_SelectedWorkspaceItemsIds } from "src/react/redux/slices/ui/workspace/workspaceSlice";

export type NameValidator = (params: { sourceId: string; name: string }) => boolean;

export const useWorkspaceItemNameValidator = (): NameValidator | null => {
  const selectedWorkspace = useAppSelector(selectStore_UI_Project_SelectedWorkspace);
  const selectedWorkspaceItemsIds = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItemsIds);

  const { data: nodes } = useGetWorkspaceItemsQuery(
    selectedWorkspace ? { workspace: selectedWorkspace, selectedWorkspaceItemsIds } : skipToken
  );
  return ({ name, sourceId }) => {
    const found = nodes
      ? nodes.workspaceItems.find((current) => current.id !== sourceId && current.data.name === name)
      : false;
    return !found;
  };
};
