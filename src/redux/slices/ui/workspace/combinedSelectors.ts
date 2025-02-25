import { createSelector } from "@reduxjs/toolkit";
import {
  selectStore_UI_Workspace_Locked,
  selectStore_UI_Workspace_MultipleSelected,
  selectStore_UI_Workspace_ResizingItemId,
  selectStore_UI_Workspace_RestrictedToolbars,
  selectStore_UI_Workspace_SelectedWorkspaceItems,
  selectStore_UI_Workspace_ShiftPressed
} from "./workspaceSlice";

export const make_selectStore_UI_Workspace_ForDashboardVisualizations = () =>
  createSelector(
    [
      selectStore_UI_Workspace_ShiftPressed,
      selectStore_UI_Workspace_Locked,
      selectStore_UI_Workspace_MultipleSelected,
      selectStore_UI_Workspace_ResizingItemId
    ],
    (shiftPressed, locked, multipleSelected, resizingItemId) => ({
      shiftPressed,
      locked,
      multipleSelected,
      resizingItemId
    })
  );

export const make_selectStore_UI_Workspace_ForNodeToolbarProvider = () =>
  createSelector(
    [selectStore_UI_Workspace_Locked, selectStore_UI_Workspace_RestrictedToolbars],
    (locked, restrictedToolbars) => ({ locked, restrictedToolbars })
  );

export const make_selectStore_UI_Workspace_ForUseDashboardsVisualizationsHook = () =>
  createSelector(
    [selectStore_UI_Workspace_SelectedWorkspaceItems, selectStore_UI_Workspace_ResizingItemId],
    (selectedWorkspaceItems, resizingItemId) => ({ selectedWorkspaceItems, resizingItemId })
  );
