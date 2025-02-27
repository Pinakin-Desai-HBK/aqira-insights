import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { appApi } from "src/react/redux/api/appApi";
import { UIWorkspaceSlice } from "src/react/redux/types/redux/workspaces";

export const extraReducers = (builder: ActionReducerMapBuilder<UIWorkspaceSlice>) => {
  builder.addMatcher(appApi.endpoints.updateWorkspaceItemName.matchFulfilled, (state, { payload: { name, id } }) => {
    state.selectedWorkspaceItems.forEach((item) => {
      if (item.data.id === id) {
        item.data.name = name;
      }
    });
    if (state.selectedWorkspaceItem?.data?.id === id) {
      state.selectedWorkspaceItem.data.name = name;
    }
  });
};
