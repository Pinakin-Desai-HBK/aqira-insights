import { Workspace } from "src/redux/types/schemas/project";
import { WorkspaceId } from "src/redux/types/redux/workspaces";
import { ReactElement } from "react";

export type UseTabMenuParams = {
  workspaceDetails: UseWorkspaceDetails | null;
  childOpen: boolean;
  setChildOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type WorkspaceTabNameValidatorParams = {
  value: string;
  type: Workspace["type"];
  index: number;
  isNameUnique: UseWorkspaceDetails["isNameUnique"];
};

export type WorkspaceTabComponentProps = {
  id: WorkspaceId;
  selected: boolean;
  index: number;
};

type IsNameUnique = (index: number, name: string) => boolean;

export type UseWorkspaceDetails = {
  workspace: Workspace;
  index: number;
  isNameUnique: IsNameUnique;
  selected: boolean;
  poppedOut: boolean;
};

export type WorkspaceTabDraggableProps = {
  index: number;
  id: string;
  disabled: boolean;
  children: ReactElement;
};
