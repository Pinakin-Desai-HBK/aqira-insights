import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { UIWorkspaceSlice } from "../../../types/redux/workspaces";
import { extraReducers } from "./extraReducers";
import { reducers } from "./reducers";

const getInitialState = (): UIWorkspaceSlice => ({
  sliceType: "uiWorkspace",
  workspaceId: null,
  blockProperties: false,
  blockPropertiesLocked: false,
  controlPressed: false,
  hasSelected: false,
  locked: false,
  mouseOver: false,
  multipleSelected: false,
  propertiesVisible: false,
  shiftPressed: false,
  selectedWorkspaceItems: [],
  selectedWorkspaceItemsIds: [],
  selectedWorkspaceItem: null,
  itemDimensionsMap: {},
  resizingItemId: null,
  restrictedToolbars: null,
  typesData: {
    Network: null,
    Dashboard: null
  },
  selecting: false,
  currentlyDraggingProperties: null
});

export const uiWorkspace = createSlice({
  name: "uiWorkspace",
  initialState: getInitialState(),
  reducers,
  extraReducers
});

// Action creators are generated for each case reducer function
export const {
  uiWorkspace_setKeys,
  uiWorkspace_setLocked,
  uiWorkspace_setSelectedWorkspaceItems,
  uiWorkspace_reset,
  uiWorkspace_blockProperties,
  uiWorkspace_setMouseOver,
  uiWorkspace_unblockProperties,
  uiWorkspace_setResizingItemEnd,
  uiWorkspace_setResizingItemStart,
  uiWorkspace_setItemDimensions,
  uiWorkspace_setTypesData,
  uiWorkspace_setSelecting,
  uiWorkspace_setCurrentlyDraggingProperties
} = uiWorkspace.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectStore_UI_Workspace = (state: RootState) => state.ui.workspace;
export const selectStore_UI_Workspace_CurrentlyDraggingProperties = (state: RootState) =>
  state.ui.workspace.currentlyDraggingProperties;
export const selectStore_UI_Workspace_ShiftPressed = (state: RootState) => state.ui.workspace.shiftPressed;
export const selectStore_UI_Workspace_SelectedWorkspaceItems = (state: RootState) =>
  state.ui.workspace.selectedWorkspaceItems;
export const selectStore_UI_Workspace_SelectedWorkspaceItemsIds = (state: RootState) =>
  state.ui.workspace.selectedWorkspaceItemsIds;
export const selectStore_UI_Workspace_SelectedWorkspaceItem = (state: RootState) =>
  state.ui.workspace.selectedWorkspaceItem;
export const selectStore_UI_Workspace_MultipleSelected = (state: RootState) => state.ui.workspace.multipleSelected;
export const selectStore_UI_Workspace_Locked = (state: RootState) => state.ui.workspace.locked;
export const selectStore_UI_Workspace_ResizingItemId = (state: RootState) => state.ui.workspace.resizingItemId;
export const selectStore_UI_Workspace_ItemDimensionsMap = (state: RootState) => state.ui.workspace.itemDimensionsMap;
export const selectStore_UI_Workspace_RestrictedToolbars = (state: RootState) => state.ui.workspace.restrictedToolbars;
export const selectStore_UI_Workspace_VisualizationTypesData = (state: RootState) =>
  state.ui.workspace.typesData.Dashboard;
export const selectStore_UI_Workspace_NodeTypesData = (state: RootState) => state.ui.workspace.typesData.Network;
export const selectStore_UI_Workspace_Selecting = (state: RootState) => state.ui.workspace.selecting;
