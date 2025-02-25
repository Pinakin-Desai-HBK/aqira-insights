import { Workspace } from "../schemas/project";
import { TypedWorkspace, WorkspaceId, WorkspaceTypes } from "./workspaces";

export type UIProjectSlice = {
  sliceType: "uiProject";
  selectedWorkspace: TypedWorkspace<WorkspaceTypes> | null;
  workspaces: Workspace[];
  poppedWorkspaceIds: WorkspaceId[];
  hasWorkspaces: boolean;
  inlineEditingWorkspaceId: WorkspaceId | null;
  isDirty: boolean;
  previouslySaved: boolean;
  scrollToSelected: boolean;
  projectChangedCount: number;
};
