import { useEffect, useContext, useCallback, useMemo } from "react";
import { LocalStorage } from "../../enums/enums";
import { DialogContext } from "../dialog/context/DialogContext";
import { shouldUseWindowsFileBrowser, sendWebMessage } from "../../helpers/wpf/wpf";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  uiDataPanel_setSearchText,
  uiDataPanel_setFolder,
  uiDataPanel_setOpenGroup,
  uiDataPanel_toggleSort,
  uiDataPanel_setLastTab,
  uiDataPanel_forceRefresh,
  uiDataPanel_setDisplayNodes,
  uiDataPanel_setDataFiles
} from "src/redux/slices/ui/dataPanel/dataPanelSlice";
import { appApi, useGetDataFilesQuery, useGetDisplayNodesQuery } from "src/redux/api/appApi";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  selectStore_UI_WebMessage,
  uiWebMessage_setWebMessageResponse
} from "src/redux/slices/ui/webMessage/webMessageSlice";
import { DataFileItem, NetworkDisplayNodeItem, UseDataExplorerResult } from "src/redux/types/ui/dataExplorer";
import { FileBrowserAction, FileSystemContentFileFilter } from "src/redux/types/ui/fileBrowser";
import { selectStore_UI_Project_SelectedWorkspace } from "src/redux/slices/ui/project/projectSlice";
import { make_selectStore_UI_DataPanel_ForUseDataExplorerlHook } from "src/redux/slices/ui/dataPanel/combinedSelectors";

const filterDataFileData = (data: DataFileItem[], searchText: string): DataFileItem[] =>
  data.filter(({ item }: DataFileItem) => item.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1);

const sortDataFilesData = (data: DataFileItem[], currentSort: "ascending" | "descending"): DataFileItem[] => {
  const sortedData = structuredClone(data);
  sortedData.sort(({ item: item1 }, { item: item2 }) => {
    const name1 = item1.name.toLowerCase();
    const name2 = item2.name.toLowerCase();
    return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
  });
  return currentSort !== "ascending" ? sortedData.reverse() : sortedData;
};

const filterDisplayNodesData = (data: NetworkDisplayNodeItem[], searchText: string): NetworkDisplayNodeItem[] =>
  !searchText || searchText.trim().length === 0
    ? data
    : data.filter(
        ({ item, node }) =>
          item.networkName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1 ||
          node.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1
      );

const sortDisplayNodesData = (
  data: NetworkDisplayNodeItem[],
  currentSort: "ascending" | "descending"
): NetworkDisplayNodeItem[] => {
  const sortedData = structuredClone(data);
  sortedData.sort(({ item: item1, node: node1 }, { item: item2, node: node2 }) => {
    const name1 = item1.networkName.toLowerCase() + node1.name.toLowerCase();
    const name2 = item2.networkName.toLowerCase() + node2.name.toLowerCase();
    return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
  });
  return currentSort !== "ascending" ? sortedData.reverse() : sortedData;
};

const prepareDataFiles = ({
  initialDataFiles,
  searchText,
  sort
}: {
  initialDataFiles: DataFileItem[];
  searchText: string;
  sort: "ascending" | "descending";
}) => {
  const sortedDataFiles = sortDataFilesData(initialDataFiles, sort);
  return searchText ? filterDataFileData(sortedDataFiles, searchText) : sortedDataFiles;
};

const prepareDisplayNodes = ({
  initialDisplayNodes,
  searchText,
  sort
}: {
  initialDisplayNodes: NetworkDisplayNodeItem[];
  searchText: string;
  sort: "ascending" | "descending";
}) => {
  const sortedDisplayNodes = sortDisplayNodesData(initialDisplayNodes, sort);
  return searchText ? filterDisplayNodesData(sortedDisplayNodes || [], searchText) : sortedDisplayNodes;
};

const useDataExplorer = (): UseDataExplorerResult => {
  const selectedWorkspace = useAppSelector(selectStore_UI_Project_SelectedWorkspace);
  const { closeDialog, openDialog } = useContext(DialogContext);
  const dataPanelSelector = useMemo(make_selectStore_UI_DataPanel_ForUseDataExplorerlHook, []);
  const { folder, searchText, sort, initialDataFiles, initialDisplayNodes, folderChangeTimestamp } =
    useAppSelector(dataPanelSelector);
  const appDispatch = useAppDispatch();
  useGetDataFilesQuery(folder ? { folder, timestamp: folderChangeTimestamp } : skipToken);
  const { refetch } = useGetDisplayNodesQuery();
  const { webMessageResponse } = useAppSelector(selectStore_UI_WebMessage);

  useEffect(() => {
    appDispatch(uiDataPanel_setDataFiles({ dataFiles: prepareDataFiles({ initialDataFiles, searchText, sort }) }));
    appDispatch(
      uiDataPanel_setDisplayNodes({ displayNodes: prepareDisplayNodes({ initialDisplayNodes, searchText, sort }) })
    );
  }, [appDispatch, initialDataFiles, initialDisplayNodes, searchText, sort]);

  const refresh = useCallback(async () => {
    appDispatch(uiDataPanel_forceRefresh());
    appApi.util.invalidateTags([{ type: "DisplayNodes" }]);
    refetch();
  }, [appDispatch, refetch]);

  const onSearchText = useCallback(
    (searchText: string) => {
      appDispatch(uiDataPanel_setSearchText({ searchText }));
    },
    [appDispatch]
  );

  const setOpenGroup = useCallback(
    (index: number) => {
      localStorage.setItem(LocalStorage.DataExplorerOpenGroup, JSON.stringify(index));
      appDispatch(uiDataPanel_setOpenGroup({ openGroup: index }));
    },
    [appDispatch]
  );

  const onSort = useCallback(() => {
    appDispatch(uiDataPanel_toggleSort());
  }, [appDispatch]);

  const onSelectFolder = useCallback(() => {
    if (shouldUseWindowsFileBrowser()) {
      sendWebMessage({ Action: "OpenFolder", Origin: "DataExplorer", Type: "Folder" });
    } else {
      openDialog({
        name: "FileDialog",
        props: {
          title: "Select Folder",
          message: "Please select a folder",
          onCancel: () => closeDialog(),
          onOk: (folder: string) => {
            closeDialog();
            appDispatch(uiDataPanel_setFolder({ folder }));
            refresh();
          },
          action: FileBrowserAction.OpenFolder,
          confirmButtonText: "Select",
          nameInputLabel: "Folder Name",
          contentFileFilter: FileSystemContentFileFilter.DataExplorer
        }
      });
    }
  }, [appDispatch, closeDialog, refresh, openDialog]);

  useEffect(() => {
    appDispatch(uiDataPanel_setLastTab({ workspace: selectedWorkspace }));
  }, [appDispatch, selectedWorkspace]);

  useEffect(() => {
    if (webMessageResponse) {
      if (
        webMessageResponse.Origin === "DataExplorer" &&
        webMessageResponse.Action === FileBrowserAction.OpenFolder &&
        webMessageResponse.Path
      ) {
        appDispatch(uiDataPanel_setFolder({ folder: webMessageResponse.Path }));
        refresh();
        appDispatch(uiWebMessage_setWebMessageResponse({ webMessageResponse: null }));
      }
    }
  }, [appDispatch, refresh, webMessageResponse]);

  return {
    onSearchText,
    onRefresh: refresh,
    onSort,
    onSelectFolder,
    setOpenGroup
  };
};

export default useDataExplorer;
