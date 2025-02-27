import { createSlice } from "@reduxjs/toolkit";
import { LocalStorage } from "src/react/enums/enums";
import { RootState } from "src/react/redux/store";
import { UIDataPanelSlice } from "src/react/redux/types/redux/dataPanel";
import { reducers } from "./reducers";
import { extraReducers } from "./extraReducers";

const getInitialState = (): UIDataPanelSlice => {
  const storedOpenGroup = localStorage.getItem(LocalStorage.DataExplorerOpenGroup);
  const storedSelectedFolder = localStorage.getItem(LocalStorage.DataExplorerSelectedFolder);
  return {
    showDataPanel: false,
    folder: storedSelectedFolder ? storedSelectedFolder : "",
    openGroup: storedOpenGroup ? parseInt(storedOpenGroup) : 0,
    noFilteredDataFiles: false,
    noFilteredDisplayNodes: false,
    noDataFilesInFolder: false,
    dataFiles: [],
    displayNodes: [],
    searchText: "",
    sort: "ascending",
    lastTab: null,
    folderChangeTimestamp: 0,
    initialDataFiles: [],
    initialDisplayNodes: [],
    columnDetails: {
      apiError: null,
      error: null,
      data: null,
      id: null,
      dataStatus: null,
      status: null
    },
    dragAndDrop: {
      dragging: null,
      count: 0
    }
  };
};

export const dataPanel = createSlice({
  name: "uiDataPanel",
  initialState: getInitialState(),
  reducers,
  extraReducers
});

export const {
  uiDataPanel_toggle,
  uiDataPanel_show,
  uiDataPanel_setFolder,
  uiDataPanel_setOpenGroup,
  uiDataPanel_setSearchText,
  uiDataPanel_toggleSort,
  uiDataPanel_setLastTab,
  uiDataPanel_forceRefresh,
  uiDataPanel_setDataFiles,
  uiDataPanel_setDisplayNodes,
  uiDataPanel_clearDataColumns,
  uiDataPanel_setDragAndDrop
} = dataPanel.actions;

export const selectStore_UI_DataPanel_ShowDataPanel = (state: RootState) => state.ui.dataPanel.showDataPanel;
export const selectStore_UI_DataPanel_DataFilesGroupOpen = (state: RootState) => state.ui.dataPanel.openGroup === 0;
export const selectStore_UI_DataPanel_DisplayNodesGroupOpen = (state: RootState) => state.ui.dataPanel.openGroup === 1;
export const selectStore_UI_DataPanel_FolderChangeTimestamp = (state: RootState) =>
  state.ui.dataPanel.folderChangeTimestamp;
export const selectStore_UI_DataPanel_Folder = (state: RootState) => state.ui.dataPanel.folder;
export const selectStore_UI_DataPanel_SearchText = (state: RootState) => state.ui.dataPanel.searchText;
export const selectStore_UI_DataPanel_Sort = (state: RootState) => state.ui.dataPanel.sort;
export const selectStore_UI_DataPanel_InitialDataFiles = (state: RootState) => state.ui.dataPanel.initialDataFiles;
export const selectStore_UI_DataPanel_InitialDisplayNodes = (state: RootState) =>
  state.ui.dataPanel.initialDisplayNodes;
export const selectStore_UI_DataPanel_DragAndDrop = (state: RootState) => state.ui.dataPanel.dragAndDrop;
export const selectStore_UI_DataPanel_DataFiles = (state: RootState) => state.ui.dataPanel.dataFiles;
export const selectStore_UI_DataPanel_DisplayNodes = (state: RootState) => state.ui.dataPanel.displayNodes;
export const selectStore_UI_DataPanel_NoDataFilesInFolder = (state: RootState) =>
  state.ui.dataPanel.noDataFilesInFolder;
export const selectStore_UI_DataPanel_NoFilteredDataFiles = (state: RootState) =>
  state.ui.dataPanel.noFilteredDataFiles;
export const selectStore_UI_DataPanel_NoFilteredDisplayNodes = (state: RootState) =>
  state.ui.dataPanel.noFilteredDisplayNodes;
export const selectStore_UI_DataPanel_ColumnDetails = (state: RootState) => state.ui.dataPanel.columnDetails;
