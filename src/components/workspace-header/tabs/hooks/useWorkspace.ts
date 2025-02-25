import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "src/redux/hooks/hooks";
import { make_selectStore_UI_Project_ForWorkspace } from "src/redux/slices/ui/project/combinedSelectors";
import { UseWorkspaceDetails } from "src/redux/types/ui/workspaceTabs";

export const useWorkspace = ({ id }: { id: string | null }): UseWorkspaceDetails | null => {
  const projectSelector = useMemo(make_selectStore_UI_Project_ForWorkspace, []);
  const { poppedWorkspaceIds, selectedWorkspace, workspaces } = useAppSelector(projectSelector);

  const isNameUnique = useCallback(
    (index: number, name: string) => {
      return !workspaces?.find((workspace, workspaceIndex) => workspaceIndex !== index && workspace.name === name);
    },
    [workspaces]
  );
  const [workspaceDetails, setWorkspaceDetails] = useState<UseWorkspaceDetails | null>(null);
  useEffect(() => {
    if (id === null || !workspaces) {
      setWorkspaceDetails(null);
      return;
    }
    const index = workspaces.findIndex((workspace) => workspace.id === id);
    const currentWorkspace = index !== undefined ? workspaces[index] : undefined;
    if (index !== undefined && currentWorkspace) {
      setWorkspaceDetails({
        workspace: currentWorkspace,
        index,
        isNameUnique,
        selected: selectedWorkspace ? selectedWorkspace.id === id : false,
        poppedOut: poppedWorkspaceIds.includes(id)
      });
    } else {
      setWorkspaceDetails(null);
    }
  }, [workspaces, id, isNameUnique, poppedWorkspaceIds, selectedWorkspace]);
  return workspaceDetails;
};
