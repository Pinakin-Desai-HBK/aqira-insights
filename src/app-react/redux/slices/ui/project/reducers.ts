import { PayloadAction } from "@reduxjs/toolkit";
import { popoutDetails } from "src/popoutDetails";
import { UIProjectSlice } from "src/redux/types/redux/project";
import { TypedWorkspace, WorkspaceId, WorkspaceTypes } from "src/redux/types/redux/workspaces";
import { getNearestUnpoppedTab } from "./support/utils";

export const reducers = {
  uiProject_openPopout: (state: UIProjectSlice, action: PayloadAction<WorkspaceId>) => {
    if (popoutDetails.popoutId !== null) {
      return;
    }
    state.poppedWorkspaceIds.push(action.payload);
    if (state.selectedWorkspace?.id === action.payload) {
      const newTabSelectionIndex = getNearestUnpoppedTab(
        action.payload,
        state.workspaces.map((current) => current.id),
        state.poppedWorkspaceIds
      );
      if (newTabSelectionIndex === null) {
        return;
      }
      const newTabSelection = state.workspaces[newTabSelectionIndex];
      if (!newTabSelection) {
        return;
      }
      state.selectedWorkspace = newTabSelection;
    }
  },
  uiProject_closePopout: (state: UIProjectSlice, action: PayloadAction<WorkspaceId>) => {
    state.poppedWorkspaceIds = state.poppedWorkspaceIds.filter((id) => id !== action.payload);
  },
  uiProject_setSelectedWorkspace: (state: UIProjectSlice, action: PayloadAction<TypedWorkspace<WorkspaceTypes>>) => {
    if (state.selectedWorkspace?.id === action.payload.id && state.selectedWorkspace?.name === action.payload.name) {
      return;
    }
    state.selectedWorkspace = action.payload;
  },
  uiProject_reorderWorkspace: (
    state: UIProjectSlice,
    action: PayloadAction<{ source: number; destination: number }>
  ) => {
    const { source, destination } = action.payload;
    const [removed] = state.workspaces.splice(source, 1);
    if (removed) state.workspaces.splice(destination, 0, removed);
  },
  uiProject_setScrollToSelected: (state: UIProjectSlice, action: PayloadAction<boolean>) => {
    state.scrollToSelected = action.payload;
  },
  uiProject_setInlineEditingWorkspaceId: (state: UIProjectSlice, action: PayloadAction<WorkspaceId | null>) => {
    state.inlineEditingWorkspaceId = action.payload;
  }
};
