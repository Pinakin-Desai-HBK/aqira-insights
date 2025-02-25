import { PayloadAction } from "@reduxjs/toolkit";
import { UIWorkspaceSlice, WorkspaceId, WorkspaceTypes } from "src/redux/types/redux/workspaces";
import { setBlockProperties, setPropertiesVisible } from "./support/stateUtils";
import { getTabLockValue, setTabLockValue } from "./support/utils";
import { PaletteData } from "src/redux/types/ui/palette";
import { Node } from "reactflow";
import { DashboardVisualizationDataUI } from "src/redux/types/ui/dashboardVisualization";
import { NetworkNodeDataUI } from "src/redux/types/ui/networkNodes";

export const reducers = {
  uiWorkspace_setCurrentlyDraggingProperties: (
    state: UIWorkspaceSlice,
    action: PayloadAction<{ currentlyDraggingProperties: string | null }>
  ) => {
    state.currentlyDraggingProperties = action.payload.currentlyDraggingProperties;
  },
  uiWorkspace_setTypesData: (
    state: UIWorkspaceSlice,
    action: PayloadAction<{ workspaceType: WorkspaceTypes; typesData: PaletteData | null }>
  ) => {
    const { typesData, workspaceType } = action.payload;
    state.typesData[workspaceType] = typesData;
  },
  uiWorkspace_setItemDimensions: (
    state: UIWorkspaceSlice,
    action: PayloadAction<{ itemId: string; itemDimensions: { width: number; height: number } }>
  ) => {
    const itemId = action.payload.itemId;
    const itemDimensions = action.payload.itemDimensions;
    state.itemDimensionsMap[itemId] = itemDimensions;
  },
  uiWorkspace_setResizingItemStart: (state: UIWorkspaceSlice, action: PayloadAction<{ itemId: string }>) => {
    const itemId = action.payload.itemId;
    state.resizingItemId = itemId;
  },
  uiWorkspace_setResizingItemEnd: (state: UIWorkspaceSlice) => {
    state.resizingItemId = null;
  },
  uiWorkspace_setSelectedWorkspaceItems: (
    state: UIWorkspaceSlice,
    action: PayloadAction<Node<DashboardVisualizationDataUI>[] | Node<NetworkNodeDataUI>[]>
  ) => {
    const { payload: selected } = action;
    state.selectedWorkspaceItems = selected;
    state.selectedWorkspaceItemsIds = selected.map(({ id }) => id);
    state.hasSelected = selected.length > 0;
    state.multipleSelected = selected.length > 1;
    state.selectedWorkspaceItem = selected.length === 1 ? selected[0]! : null;
    setPropertiesVisible(state);
  },
  uiWorkspace_reset: (state: UIWorkspaceSlice, action: PayloadAction<WorkspaceId>) => {
    const workspaceId = action.payload;
    if (workspaceId === state.workspaceId) return;
    const storedLockValue = getTabLockValue(workspaceId);
    state.workspaceId = workspaceId;
    state.blockProperties = false;
    state.blockPropertiesLocked = false;
    state.controlPressed = false;
    state.hasSelected = false;
    state.locked = storedLockValue;
    state.mouseOver = false;
    state.multipleSelected = false;
    state.propertiesVisible = false;
    state.shiftPressed = false;
    state.selectedWorkspaceItems = [];
    state.selectedWorkspaceItemsIds = [];
    state.selectedWorkspaceItem = null;
    state.resizingItemId = null;
    state.itemDimensionsMap = {};
  },
  uiWorkspace_setLocked: (state: UIWorkspaceSlice, action: PayloadAction<boolean>) => {
    const locked = action.payload;
    setTabLockValue(state.workspaceId, locked);
    state.locked = locked;
    state.selectedWorkspaceItems = [];
    state.selectedWorkspaceItemsIds = [];
    state.selectedWorkspaceItem = null;
    state.hasSelected = false;
    state.multipleSelected = false;
    state.propertiesVisible = false;
    state.resizingItemId = null;
  },
  uiWorkspace_blockProperties: (state: UIWorkspaceSlice) => {
    setBlockProperties(state, { blockProperties: true, blockPropertiesLocked: true });
  },
  uiWorkspace_unblockProperties: (state: UIWorkspaceSlice) => {
    setBlockProperties(state, { blockProperties: false, blockPropertiesLocked: false });
  },
  uiWorkspace_setMouseOver: (state: UIWorkspaceSlice, action: PayloadAction<boolean>) => {
    state.mouseOver = action.payload;
    setPropertiesVisible(state);
  },
  uiWorkspace_setKeys: (
    state: UIWorkspaceSlice,
    action: PayloadAction<{ controlPressed: boolean; shiftPressed: boolean }>
  ) => {
    const {
      payload: { controlPressed, shiftPressed }
    } = action;
    const blockPropertiesLockedValue = state.blockPropertiesLocked;
    state.controlPressed = controlPressed;
    state.shiftPressed = shiftPressed;
    state.blockProperties = blockPropertiesLockedValue
      ? state.blockProperties
      : state.mouseOver && (controlPressed || shiftPressed);
    setPropertiesVisible(state);
  },
  uiWorkspace_setRestrictedToolbars: (
    state: UIWorkspaceSlice,
    action: PayloadAction<{ restrictedToolbars: string[] | null }>
  ) => {
    state.restrictedToolbars = action.payload.restrictedToolbars;
  },
  uiWorkspace_setSelecting: (state: UIWorkspaceSlice, action: PayloadAction<boolean>) => {
    state.selecting = action.payload;
  }
};
