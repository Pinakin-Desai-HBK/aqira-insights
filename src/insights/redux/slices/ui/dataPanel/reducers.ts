import { PayloadAction } from "@reduxjs/toolkit";
import { LocalStorage } from "src/insights/enums/enums";
import { Workspace } from "src/insights/redux/types/schemas/project";
import { DataFileItem, NetworkDisplayNodeItem } from "src/insights/redux/types/ui/dataExplorer";
import { DragAndDropDetails, UIDataPanelSlice } from "src/insights/redux/types/redux/dataPanel";

export const reducers = {
  uiDataPanel_clearDataColumns: (state: UIDataPanelSlice) => {
    state.columnDetails = { id: null, data: null, error: null, apiError: null, status: null, dataStatus: null };
  },
  uiDataPanel_toggle: (state: UIDataPanelSlice) => {
    state.showDataPanel = !state.showDataPanel;
    if (state.showDataPanel) {
      state.folderChangeTimestamp = Date.now();
    }
  },
  uiDataPanel_show: (state: UIDataPanelSlice, action: PayloadAction<{ show: boolean }>) => {
    const { show } = action.payload;
    state.showDataPanel = show;
    if (state.showDataPanel) {
      state.folderChangeTimestamp = Date.now();
    }
  },
  uiDataPanel_setFolder: (state: UIDataPanelSlice, action: PayloadAction<{ folder: string }>) => {
    const { folder } = action.payload;
    if (folder !== state.folder) {
      state.folderChangeTimestamp = Date.now();
    }
    localStorage.setItem(LocalStorage.DataExplorerSelectedFolder, folder);
    state.folder = folder;
  },
  uiDataPanel_setOpenGroup: (state: UIDataPanelSlice, action: PayloadAction<{ openGroup: number }>) => {
    const { openGroup } = action.payload;
    localStorage.setItem(LocalStorage.DataExplorerOpenGroup, openGroup.toString());
    state.openGroup = openGroup;
  },
  uiDataPanel_setSearchText: (state: UIDataPanelSlice, action: PayloadAction<{ searchText: string }>) => {
    const { searchText } = action.payload;
    state.searchText = searchText;
  },
  uiDataPanel_toggleSort: (state: UIDataPanelSlice) => {
    state.sort = state.sort === "ascending" ? "descending" : "ascending";
  },
  uiDataPanel_setLastTab: (state: UIDataPanelSlice, action: PayloadAction<{ workspace: Workspace | null }>) => {
    const { workspace } = action.payload;
    if (workspace === null) {
      return;
    }
    if (state.lastTab?.id !== workspace?.id && workspace?.type === "Network") {
      state.openGroup = 0;
    }
    if (state.lastTab?.id !== workspace?.id && workspace?.type === "Dashboard" && state.displayNodes.length > 0) {
      state.openGroup = 1;
    }
    state.lastTab = workspace;
  },
  uiDataPanel_forceRefresh: (state: UIDataPanelSlice) => {
    state.folderChangeTimestamp = Date.now();
  },
  uiDataPanel_setDataFiles: (state: UIDataPanelSlice, action: PayloadAction<{ dataFiles: DataFileItem[] }>) => {
    state.dataFiles = action.payload.dataFiles;
    state.noFilteredDataFiles = state.searchText.length !== 0 && state.dataFiles.length === 0;
  },
  uiDataPanel_setDisplayNodes: (
    state: UIDataPanelSlice,
    action: PayloadAction<{ displayNodes: NetworkDisplayNodeItem[] }>
  ) => {
    state.displayNodes = action.payload.displayNodes;
    state.noFilteredDisplayNodes = state.searchText.length !== 0 && state.displayNodes.length === 0;
  },
  uiDataPanel_setDragAndDrop: (state: UIDataPanelSlice, action: PayloadAction<DragAndDropDetails>) => {
    state.dragAndDrop = action.payload;
  }
};
