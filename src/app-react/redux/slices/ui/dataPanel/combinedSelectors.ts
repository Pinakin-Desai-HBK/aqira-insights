import { createSelector } from "@reduxjs/toolkit";
import {
  selectStore_UI_DataPanel_ColumnDetails,
  selectStore_UI_DataPanel_DataFiles,
  selectStore_UI_DataPanel_DataFilesGroupOpen,
  selectStore_UI_DataPanel_DisplayNodes,
  selectStore_UI_DataPanel_DisplayNodesGroupOpen,
  selectStore_UI_DataPanel_Folder,
  selectStore_UI_DataPanel_FolderChangeTimestamp,
  selectStore_UI_DataPanel_InitialDataFiles,
  selectStore_UI_DataPanel_InitialDisplayNodes,
  selectStore_UI_DataPanel_NoDataFilesInFolder,
  selectStore_UI_DataPanel_NoFilteredDataFiles,
  selectStore_UI_DataPanel_NoFilteredDisplayNodes,
  selectStore_UI_DataPanel_SearchText,
  selectStore_UI_DataPanel_Sort
} from "./dataPanelSlice";

export const make_selectStore_UI_DataPanel_ForUseDataExplorerlHook = () =>
  createSelector(
    [
      selectStore_UI_DataPanel_Folder,
      selectStore_UI_DataPanel_SearchText,
      selectStore_UI_DataPanel_Sort,
      selectStore_UI_DataPanel_InitialDataFiles,
      selectStore_UI_DataPanel_InitialDisplayNodes,
      selectStore_UI_DataPanel_FolderChangeTimestamp
    ],
    (folder, searchText, sort, initialDataFiles, initialDisplayNodes, folderChangeTimestamp) => ({
      folder,
      searchText,
      sort,
      initialDataFiles,
      initialDisplayNodes,
      folderChangeTimestamp
    })
  );

export const make_selectStore_UI_DataPanel_ForDataExplorer = () =>
  createSelector(
    [
      selectStore_UI_DataPanel_DisplayNodes,
      selectStore_UI_DataPanel_NoFilteredDisplayNodes,
      selectStore_UI_DataPanel_InitialDisplayNodes,
      selectStore_UI_DataPanel_DataFilesGroupOpen,
      selectStore_UI_DataPanel_DisplayNodesGroupOpen
    ],
    (displayNodes, noFilteredDisplayNodes, initialDisplayNodes, dataFilesGroupOpen, displayNodesGroupOpen) => ({
      displayNodes,
      noFilteredDisplayNodes,
      initialDisplayNodes,
      dataFilesGroupOpen,
      displayNodesGroupOpen
    })
  );

export const make_selectStore_UI_DataPanel_ForDataFiles = () =>
  createSelector(
    [
      selectStore_UI_DataPanel_DataFiles,
      selectStore_UI_DataPanel_NoDataFilesInFolder,
      selectStore_UI_DataPanel_NoFilteredDataFiles,
      selectStore_UI_DataPanel_Folder,
      selectStore_UI_DataPanel_InitialDataFiles,
      selectStore_UI_DataPanel_DataFilesGroupOpen
    ],
    (dataFiles, noDataFilesInFolder, noFilteredDataFiles, folder, initialDataFiles, dataFilesGroupOpen) => ({
      dataFiles,
      noDataFilesInFolder,
      noFilteredDataFiles,
      folder,
      initialDataFiles,
      dataFilesGroupOpen
    })
  );

export const make_selectStore_UI_DataPanel_ForColumnDetails = () =>
  createSelector(
    [selectStore_UI_DataPanel_FolderChangeTimestamp, selectStore_UI_DataPanel_ColumnDetails],
    (folderChangeTimestamp, columnDetails) => ({
      folderChangeTimestamp,
      columnDetails
    })
  );
