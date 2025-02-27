import { WorkspaceId } from "src/react/redux/types/redux/workspaces";

export const getNearestUnpoppedTab = (poppedId: WorkspaceId, workspaceIds: string[], poppedWorkspaceIds: string[]) => {
  const index = workspaceIds.findIndex((id) => poppedId === id);
  const min = 0;
  const max = workspaceIds.length - 1;
  if (index > -1) {
    const indexes = {
      target: -1,
      left: index - 1,
      right: index + 1
    };
    while (indexes.target === -1 && (indexes.left >= min || indexes.right <= max)) {
      if (indexes.target === -1 && indexes.left >= min) {
        const leftTab = workspaceIds[indexes.left];
        if (leftTab && !poppedWorkspaceIds.includes(leftTab)) {
          indexes.target = indexes.left;
        }
      }
      if (indexes.target === -1 && indexes.right <= max) {
        const rightTab = workspaceIds[indexes.right];
        if (rightTab && !poppedWorkspaceIds.includes(rightTab)) {
          indexes.target = indexes.right;
        }
      }
      indexes.left--;
      indexes.right++;
    }
    if (indexes.target >= 0) {
      return indexes.target;
    }
  }
  return null;
};
