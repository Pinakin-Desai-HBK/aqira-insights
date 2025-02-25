import { createSelector } from "@reduxjs/toolkit";
import {
  selectStore_UI_Project_IsDirty,
  selectStore_UI_Project_PoppedWorkspaceIds,
  selectStore_UI_Project_PreviouslySaved,
  selectStore_UI_Project_ScrollToSelected,
  selectStore_UI_Project_SelectedWorkspace,
  selectStore_UI_Project_WorkspaceList
} from "./projectSlice";

export const make_selectStore_UI_Project_ForHeaderMenuItemsHook = () =>
  createSelector(
    [selectStore_UI_Project_IsDirty, selectStore_UI_Project_PreviouslySaved, selectStore_UI_Project_WorkspaceList],
    (isDirty, previouslySaved, workspaces) => ({ isDirty, previouslySaved, workspaces })
  );

export const make_selectStore_UI_Project_ForWorkspace = () =>
  createSelector(
    [
      selectStore_UI_Project_SelectedWorkspace,
      selectStore_UI_Project_WorkspaceList,
      selectStore_UI_Project_PoppedWorkspaceIds
    ],
    (selectedWorkspace, workspaces, poppedWorkspaceIds) => ({ selectedWorkspace, workspaces, poppedWorkspaceIds })
  );

export const make_selectStore_UI_Project_ForWorkspaceTabs = () =>
  createSelector(
    [
      selectStore_UI_Project_SelectedWorkspace,
      selectStore_UI_Project_WorkspaceList,
      selectStore_UI_Project_ScrollToSelected
    ],
    (selectedWorkspace, workspaces, scrollToSelected) => ({ selectedWorkspace, workspaces, scrollToSelected })
  );

export const make_selectStore_UI_Project_ForMain = () =>
  createSelector(
    [selectStore_UI_Project_WorkspaceList, selectStore_UI_Project_PoppedWorkspaceIds],
    (workspaces, poppedWorkspaceIds) => ({ workspaces, poppedWorkspaceIds })
  );

export const make_selectStore_UI_Project_ForShellHelper = () =>
  createSelector([selectStore_UI_Project_IsDirty, selectStore_UI_Project_WorkspaceList], (isDirty, workspaces) => ({
    isDirty,
    workspaces
  }));
