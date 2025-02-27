import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { popoutDetails } from "src/react/popoutDetails";
import { appApi } from "src/react/redux/api/appApi";
import { UIProjectSlice } from "src/react/redux/types/redux/project";
import { Project } from "src/react/redux/types/schemas/project";
import { signalRSubscribeTabs } from "src/react/signalR/signalRSubscribeTabs";

export const extraReducers = (builder: ActionReducerMapBuilder<UIProjectSlice>) => {
  const updateProject = (state: UIProjectSlice, project: Project) => {
    state.previouslySaved = project.filepath !== null;
    state.isDirty = project.modified;
  };
  builder.addMatcher(appApi.endpoints.getCurrentProject.matchFulfilled, (state, { payload: project }) =>
    updateProject(state, project)
  );
  builder.addMatcher(appApi.endpoints.loadProject.matchFulfilled, (state, { payload: project }) => {
    updateProject(state, project);
    state.projectChangedCount = state.projectChangedCount + 1;
    state.poppedWorkspaceIds = [];
  });
  builder.addMatcher(appApi.endpoints.saveProject.matchFulfilled, (state, { payload: project }) =>
    updateProject(state, project)
  );
  builder.addMatcher(appApi.endpoints.newProject.matchFulfilled, (state) => {
    state.previouslySaved = false;
    state.isDirty = false;
    state.projectChangedCount = state.projectChangedCount + 1;
    state.poppedWorkspaceIds = [];
  });
  builder.addMatcher(appApi.endpoints.createWorkspace.matchFulfilled, (state, { payload: workspace }) => {
    if (state.workspaces.find((current) => current.id === workspace.id) === null) {
      state.workspaces.push(workspace);
    }
    state.selectedWorkspace = workspace;
    state.scrollToSelected = true;
  });
  builder.addMatcher(appApi.endpoints.getWorkspaces.matchFulfilled, (state, { payload: workspaces }) => {
    setTimeout(() => signalRSubscribeTabs(workspaces), 0);

    state.workspaces = workspaces;
    state.hasWorkspaces = workspaces.length > 0;
    const firstWorkspace = state.workspaces[0];

    // The window is a popout so don't set the selected workspace
    if (popoutDetails.popoutId !== null) {
      return;
    }

    // Set the selected workspace to null if there no workspaces
    if (!firstWorkspace) {
      state.selectedWorkspace = null;
      return;
    }

    // Set the selected workspace to the first workspace if not already set
    if (!state.selectedWorkspace) {
      state.selectedWorkspace = firstWorkspace;
      return;
    }

    // Set the selected workspace to the first workspace if the previously selected workspaceis not in the list of workspaces
    if (!state.workspaces.find((current) => current.id === state.selectedWorkspace?.id)) {
      if (state.selectedWorkspace?.id === firstWorkspace.id) {
        return;
      }
      state.selectedWorkspace = firstWorkspace;
      return;
    }
  });
};
