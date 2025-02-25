import { Workspace } from "src/redux/types/schemas/project";
import { DataFileItem } from "./dataExplorer";
import { JSX } from "react";

export type EmptyMessage = NonNullable<unknown>;

export type PopTabMessage = { id: string };

export type ClosePopTabMessage = { id: string };

export type ReleasePopTabMessage = { id: string };

export type OpenGlobalSpeedDialMessage = {
  id: string;
  options: SpeedDialItem[];
  position: { x: number; y: number };
  onSelection: (id: string) => void;
  onClose: () => void;
};

export type SpeedDialItem = { id: string; title: string; icon: JSX.Element };

export type DeleteTabMessage = { id: string; index: number; type: Workspace["type"] };

export type RenameTabMessage = { id: string; name: string; type: Workspace["type"] };

export type CreateNetworkMessage = EmptyMessage;

export type CreateDashboardMessage = EmptyMessage;

export type SwitchExpressionMessage = EmptyMessage;

export type SwitchValueMessage = EmptyMessage;

export type EditExpressionMessage = EmptyMessage;

export type ViewColumnDetailsMessage = { source: DataFileItem };
