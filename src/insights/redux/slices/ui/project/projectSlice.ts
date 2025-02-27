import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { UIProjectSlice } from "src/insights/redux/types/redux/project";
import { extraReducers } from "./extraReducers";
import { reducers } from "./reducers";

const getInitialState = (): UIProjectSlice => ({
  sliceType: "uiProject",
  selectedWorkspace: null,
  workspaces: [],
  poppedWorkspaceIds: [],
  hasWorkspaces: false,
  inlineEditingWorkspaceId: null,
  isDirty: false,
  previouslySaved: false,
  scrollToSelected: false,
  projectChangedCount: 0
});

export const uiProject = createSlice({
  name: "uiProject",
  initialState: getInitialState(),
  reducers,
  extraReducers
});

// Action creators are generated for each case reducer function
export const {
  uiProject_setSelectedWorkspace,
  uiProject_reorderWorkspace,
  uiProject_openPopout,
  uiProject_closePopout,
  uiProject_setScrollToSelected,
  uiProject_setInlineEditingWorkspaceId
} = uiProject.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectStore_UI_Project_WorkspaceList = (state: RootState) => state.ui.project.workspaces;
export const selectStore_UI_Project_HasWorkspaces = (state: RootState) => state.ui.project.hasWorkspaces;
export const selectStore_UI_Project_SelectedWorkspace = (state: RootState) => state.ui.project.selectedWorkspace;
export const selectStore_UI_Project_PoppedWorkspaceIds = (state: RootState) => state.ui.project.poppedWorkspaceIds;
export const selectStore_UI_Project_IsDirty = (state: RootState) => state.ui.project.isDirty;
export const selectStore_UI_Project_PreviouslySaved = (state: RootState) => state.ui.project.previouslySaved;
export const selectStore_UI_Project_ScrollToSelected = (state: RootState) => state.ui.project.scrollToSelected;
export const selectStore_UI_Project_InlineEditingWorkspaceId = (state: RootState) =>
  state.ui.project.inlineEditingWorkspaceId;
