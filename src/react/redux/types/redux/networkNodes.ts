import { Workspace } from "src/react/redux/types/schemas/project";

export type WorkspaceItemPositionMutation = WorkspaceItemIdentifier & {
  newPosition: { x: number; y: number };
};

export type WorkspaceItemNameMutation = WorkspaceItemIdentifier & {
  newName: string;
};

export type WorkspaceItemIdentifier = {
  workspaceItem: { type: string; id: string };
  workspace: Workspace;
};

export type WorkspaceItemsIdentifier = {
  workspaceItems: { type: string; id: string }[];
  workspace: Workspace;
};
