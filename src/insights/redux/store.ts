import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { uiProject } from "src/insights/redux/slices/ui/project/projectSlice";
import { uiApp } from "./slices/ui/app/uiAppSlice";
import { createStateSyncMiddleware, withReduxStateSync } from "redux-state-sync";
import { appApi } from "./api/appApi";
import { uiWorkspace } from "./slices/ui/workspace/workspaceSlice";
import { invalidateProjectDataMiddleware } from "./api/middleware/invalidateProjectDataMiddleware";
import { invalidateTagsMiddleware } from "./api/middleware/invalidateTagsMiddleware";
import { uiLogPanel } from "./slices/ui/logPanel/logPanelSlice";
import { dataPanel } from "./slices/ui/dataPanel/dataPanelSlice";
import { uiWebMessage } from "./slices/ui/webMessage/webMessageSlice";
import { uiToast } from "./slices/ui/toast/toastSlice";

const devTools = process.env.NODE_ENV === "development";

console.log(`Redux devTools enabled: ${devTools}`);

const rootReducer = withReduxStateSync(
  combineReducers({
    ui: combineReducers({
      app: uiApp.reducer,
      project: uiProject.reducer,
      workspace: uiWorkspace.reducer,
      logPanel: uiLogPanel.reducer,
      dataPanel: dataPanel.reducer,
      webMessage: uiWebMessage.reducer,
      toast: uiToast.reducer
    }),
    [appApi.reducerPath]: appApi.reducer
  })
);

const blacklist = [
  "uiWorkspace",
  "appDataApi",
  "uiDataPanel/uiDataPanel_toggle",
  "uiWebMessage",
  "uiProject/uiProject_setSelectedWorkspace",
  "uiToast"
];

export const store = configureStore({
  reducer: rootReducer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(
      appApi.middleware,
      invalidateProjectDataMiddleware,
      invalidateTagsMiddleware,
      createStateSyncMiddleware({
        predicate: (action) => {
          for (let i = 0; i < blacklist.length; i++) {
            if (action.type.startsWith(blacklist[i])) {
              return false;
            }
          }
          return true;
        }
      })
    ),
  devTools
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>; //ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
