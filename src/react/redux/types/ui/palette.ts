import { ReactElement } from "react";

type NodeContent = "NodeContent";
type VisualizationContent = "VisualizationContent";
export type PaletteContentType = NodeContent | VisualizationContent;

type SideBarItemIdName =
  | "about"
  | "data"
  | "feedback"
  | "help"
  | "log"
  | "nodes"
  | `separator${number}`
  | "visualizations";

export type InitallySelectableSideBarItemIdName = Extract<SideBarItemIdName, "data" | "nodes" | "visualizations">;

type BaseSideBarItem = {
  id: number;
  idName: SideBarItemIdName;
};

export type PalettePanelSideBarItem = BaseSideBarItem & {
  type: "palettePanelItem";
  component: ReactElement;
  selected: boolean;
  icon: ReactElement;
  label: string;
};

export type UIPanelSideBarItem = BaseSideBarItem & {
  type: "uiPanelItem";
  includeInPopout: boolean;
  selected: boolean;
  icon: ReactElement;
  label: string;
};

export type UIPanelSideBarEventlessItem = BaseSideBarItem & {
  type: "uiPanelEventlessItem";
  includeInPopout: boolean;
  selected: boolean;
  icon: ReactElement;
  label: string;
};

type SeparatorSideBarItem = BaseSideBarItem & {
  type: "separatorItem";
  includeInPopout: boolean;
};

export type SideBarItem =
  | PalettePanelSideBarItem
  | UIPanelSideBarItem
  | SeparatorSideBarItem
  | UIPanelSideBarEventlessItem;

export type PaletteDisplayMode = "icons" | "titles";

export const NodeGroupColor: Record<string, string> = {
  Analysis: "#9AD0A7",
  Anomalies: "#F08A4B",
  Fatigue: "#456990",
  "Input / Output": "#739DB9",
  Manipulation: "#028090",
  Scripting: "#EDAE49"
};

export const VisualizationGroupColor: Record<string, string> = {
  General: "#9AD0A7",
  "Line Charts": "#F08A4B"
};

export type PaletteItemData = {
  color: string;
  description: string;
  icon: string;
  type: string;
  name: string | null;
  properties: string | null;
};

export type PaletteGroupData = {
  groupName: string;
  items: PaletteItemData[];
};

export type GroupColours = { [k: string]: string };

export type PaletteData = {
  groups: string[];
  groupColours: GroupColours;
  groupItemsMap: {
    [groupName: string]: PaletteItemData[];
  };
  itemsArray: PaletteItemData[];
  itemsMap: {
    [type: string]: PaletteItemData;
  };
};

export type PaletteDisplayButtonProps = {
  displayMode: PaletteDisplayMode;
  selected: boolean;
  src: string;
  idPart: string;
};

export type PaletteContextState = {
  idPart: string;
  title: string;
  dataFormat: string;
  paletteData: PaletteData;
  itemLabel: string;
  itemLabelPlural: string;
  type: PaletteContentType;
  isNodeContent: boolean;
  displayModeKey: string;
  openGroupsKey: string;
  openGroups: string[];
  displayMode: PaletteDisplayMode;
  searchText: string;
  searchItems: PaletteItemData[];
};

export type PaletteContextAction =
  | {
      type: "setDisplayMode";
      payload: { displayMode: PaletteDisplayMode };
    }
  | {
      type: "toggleGroup";
      payload: { expanded: boolean; group: string };
    }
  | {
      type: "setSearchText";
      payload: { searchText: string };
    };

export type PaletteContextData = PaletteContextState & {
  paletteContextDispatch: React.Dispatch<PaletteContextAction>;
};

export type PaletteItemProps = {
  item: PaletteItemData;
};

export type PaletteContextInitialStateParams = {
  type: PaletteContentType;
  nodesPaletteData: PaletteData;
  visualizationsPaletteData: PaletteData;
};

export type PaletteItemDraggableProps = { color: string; icon: string; selected: boolean };
