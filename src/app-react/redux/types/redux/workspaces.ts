import { QueryReturnValue } from "@reduxjs/toolkit/query";
import { DashboardVisualizationDataUI } from "../ui/dashboardVisualization";
import { Node } from "reactflow";
import { NetworkNodeDataUI } from "../ui/networkNodes";
import { PaletteData } from "../ui/palette";

export type WorkspaceId = string;

export type Dimensions = { width: number; height: number };

type DimensionsMap<T> = { [K in string]: T };

export type CurrentlyDraggingNodeDetails = {
  id: string;
  hasFreeInputAndOutputPorts: boolean;
  inputPorts: {
    name: string;
  }[];
  outputPorts: {
    name: string;
  }[];
  freeInputPorts: string[];
  freeOutputPorts: string[];
};

export type UIWorkspaceSlice = {
  sliceType: "uiWorkspace";
  workspaceId: WorkspaceId | null;
  selectedWorkspaceItems: Node<DashboardVisualizationDataUI>[] | Node<NetworkNodeDataUI>[];
  selectedWorkspaceItemsIds: string[];
  selectedWorkspaceItem: Node<DashboardVisualizationDataUI> | Node<NetworkNodeDataUI> | null;
  multipleSelected: boolean;
  hasSelected: boolean;
  locked: boolean;
  blockProperties: boolean;
  blockPropertiesLocked: boolean;
  propertiesVisible: boolean;
  mouseOver: boolean;
  controlPressed: boolean;
  shiftPressed: boolean;
  resizingItemId: string | null;
  itemDimensionsMap: DimensionsMap<Dimensions>;
  restrictedToolbars: string[] | null;
  typesData: { [k in WorkspaceTypes]: PaletteData | null };
  selecting: boolean;
  currentlyDraggingProperties: string | null;
};

export type WorkspaceTypes = "Network" | "Dashboard";

export type TypedWorkspace<T extends WorkspaceTypes> = T extends "Network"
  ? {
      id: string;
      name: string;
      type: T;
    }
  : T extends "Dashboard"
    ? {
        id: string;
        name: string;
        type: T;
      }
    : never;

export type WorkspaceItems<T extends WorkspaceTypes> = T extends "Network"
  ? {
      workspaceType: T;
      workspaceItems: Node<NetworkNodeDataUI>[];
    }
  : T extends "Dashboard"
    ? {
        workspaceType: T;
        workspaceItems: Node<DashboardVisualizationDataUI>[];
      }
    : never;

type GetWorkspaceItemsAttributes<T extends "Network" | "Dashboard"> = {
  workspace: TypedWorkspace<T>;
  selectedWorkspaceItemsIds: string[];
  typesData: PaletteData;
};

export type UseGetWorkspaceItemsQueryTyped<T> = T extends "Network" | "Dashboard"
  ? (args: GetWorkspaceItemsAttributes<T>) => QueryReturnValue<WorkspaceItems<T>>
  : never;
