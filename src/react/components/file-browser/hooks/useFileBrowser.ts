import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { LocalStorage } from "../../../enums/enums";
import { constructNewNavigationPaneTree } from "../helpers/construct-new-navigation-pane-tree/construct-new-navigation-pane-tree";
import useFileSystem from "./useFileSystem";
import { getNavigationPaneDataFromFileSystemData } from "../helpers/get-navigation-pane-data-from-file-system-data/get-navigation-pane-data-from-file-system-data";
import { FILE_SEPARATOR, NAVIGATION_PANE_TREE_ROOT } from "../consts/consts";
import { getPathsFromPath } from "../helpers/get-paths-from-path/get-paths-from-path";
import { PROJECT_FILE_EXTENSION } from "../../../consts/consts";
import { DialogContext } from "../../dialog/context/DialogContext";
import { APIError } from "src/react/redux/api/utils/responseValidator";
import { useGetFoldersContentsQuery } from "src/react/redux/api/appApi";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  FileBrowserAction,
  FileSystemContentFileFilter,
  FileSystemContentType,
  GetFolderContentsParams,
  UseFileBrowserData
} from "src/react/redux/types/ui/fileBrowser";

const useFileBrowser = (contentFileFilter: FileSystemContentFileFilter): UseFileBrowserData => {
  const { closeDialog, openDialog } = useContext(DialogContext);

  // Holds the folders that have been expaned in the navigation pane so that API calls aren't made for the same folder multiple times
  const expandedFolders = useRef<string[]>([]);

  // Defines the folder to get from the API for the navigation pane
  const [navigationPaneFolderToGet, setNavigationPaneFolderToGet] = useState<string | null>(null);

  // Defines the folder to get from the API for the file list
  const [fileListFolderToGet, setFileListFolderToGet] = useState<string | null>(null);

  // Holds the navigation pane tree structure
  const [navigationPaneTree, setNavigationPaneTree] = useState<TreeViewBaseItem>(NAVIGATION_PANE_TREE_ROOT);

  // Holds the currently expanded folders in the navigation pane to display as expanded
  const [navigationPaneTreeExpanded, setNavigationPaneTreeExpanded] = useState<string[]>([
    NAVIGATION_PANE_TREE_ROOT.id
  ]);

  // Holds the selected folder in the file list
  const [selectedFolder, setSelectedFolder] = useState<{ folder: TreeViewBaseItem; path: string[] }>({
    folder: navigationPaneTree.children![0]!,
    path: [NAVIGATION_PANE_TREE_ROOT.id]
  });

  // Holds the selected folder in the navigation pane
  const [navigationPaneTreeSelectedFolder, setNavigationPaneTreeSelectedFolder] = useState<string>(
    NAVIGATION_PANE_TREE_ROOT.id
  );

  // Holds the index of the selected file in the file list
  const [fileListSelectedIndex, setFileListSelectedIndex] = useState(-1);

  // Holds the current action to be performed by the file browser
  const [currentAction, setCurrentAction] = useState<FileBrowserAction>(FileBrowserAction.OpenFile);

  // Holds the value of the name input field
  const [nameInputValue, setNameInputValue] = useState("");

  // Holds the error message for the name input field
  const [nameInputErrorMessage, setNameInputErrorMessage] = useState("");

  // Holds the disbaled state of the confirm button
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);

  // Holds the function to be called when the file browser is closed
  const [onClose, setOnClose] = useState<() => void>(() => {
    return;
  });

  // Holds the function to be called when the confirm button is clicked
  const [onConfirm, setOnConfirm] = useState<(path: string) => void>(() => {
    return;
  });

  // Holds the name of a file that exists in the selected folder
  const [fileExists, setFileExists] = useState("");

  const [timestamp] = useState(Date.now());

  // Gets the folder from the API for the navigation pane
  const { folder: navigationPaneFolder } = useFileSystem(
    navigationPaneFolderToGet,
    FileSystemContentType.Folder,
    contentFileFilter,
    timestamp
  );

  // Gets the folder from the API for the file list
  const { folder: fileListFolder } = useFileSystem(
    fileListFolderToGet,
    currentAction === FileBrowserAction.OpenFolder ? FileSystemContentType.Folder : FileSystemContentType.Both,
    contentFileFilter,
    timestamp
  );

  const [pathsDetails, setPathsDetails] = useState<{
    pathsToGet: string[];
    path: string | null;
    encodedPathsToGet: string[];
  } | null>(null);
  const [foldersContentsParams, setFoldersContentsParams] = useState<GetFolderContentsParams[] | null>(null);

  const { data: foldersContentsResult } = useGetFoldersContentsQuery(foldersContentsParams ?? skipToken);
  useEffect(() => {
    if (pathsDetails) {
      const foldersContentsParams = pathsDetails.encodedPathsToGet.map((encodedPath) => {
        return {
          folder: encodedPath,
          contentType: FileSystemContentType.Folder,
          contentFileFilter,
          timestamp: Date.now()
        };
      });
      setFoldersContentsParams(foldersContentsParams);
    }
  }, [contentFileFilter, pathsDetails]);

  useEffect(() => {
    if (pathsDetails && foldersContentsResult) {
      const process = async () => {
        let newTree = NAVIGATION_PANE_TREE_ROOT;
        const newExpanded: string[] = [];
        foldersContentsResult
          .filter((current) => current !== null)
          .forEach((current) => {
            newTree = constructNewNavigationPaneTree(getNavigationPaneDataFromFileSystemData(current), newTree);
            newExpanded.push(current.folderFullName ? current.folderFullName : NAVIGATION_PANE_TREE_ROOT.id);
            expandedFolders.current.push(
              current.folderFullName ? current.folderFullName : NAVIGATION_PANE_TREE_ROOT.id
            );
          });
        setNavigationPaneTreeExpanded(newExpanded);
        setNavigationPaneTree(newTree);
        setNavigationPaneTreeSelectedFolder(pathsDetails.path ? pathsDetails.path : NAVIGATION_PANE_TREE_ROOT.id);
      };
      process();
    }
  }, [contentFileFilter, foldersContentsResult, pathsDetails]);

  // Create the navigation pane tree from a path
  const createNavigationPaneFromPath = useCallback(async (path: string) => {
    const pathsToGet = getPathsFromPath(path);
    setPathsDetails({ pathsToGet, path, encodedPathsToGet: pathsToGet.map((path) => encodeURIComponent(path)) });
  }, []);

  const getSelectedFolder = useCallback(
    async (storedSelectedFolder: string) => {
      try {
        await createNavigationPaneFromPath(storedSelectedFolder);
        setFileListFolderToGet(storedSelectedFolder);
      } catch {
        expandedFolders.current = [];
        setNavigationPaneTreeExpanded([NAVIGATION_PANE_TREE_ROOT.id]);
        setNavigationPaneFolderToGet("");
        setFileListFolderToGet("");
      }
    },
    [createNavigationPaneFromPath]
  );

  const saveFolder = useCallback((id: string) => {
    localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, id);
  }, []);

  // This handles the path part selection in the address bar
  const handlePathPartSelection = useCallback(
    (pathPartIndex: number) => {
      if (pathPartIndex === 0) {
        setFileListFolderToGet("");
        saveFolder("");
      } else if (pathPartIndex === 1) {
        setFileListFolderToGet(selectedFolder.path[1] + FILE_SEPARATOR);
        saveFolder(selectedFolder.path[1]!);
      } else {
        saveFolder(selectedFolder.path.slice(1, pathPartIndex + 1).join(FILE_SEPARATOR));
        setFileListFolderToGet(selectedFolder.path.slice(1, pathPartIndex + 1).join(FILE_SEPARATOR));
      }
    },
    [selectedFolder.path, saveFolder]
  );

  const handleNavigationPaneItemExpansion = useCallback(
    (_event: React.SyntheticEvent<Element, Event>, itemId: string, isExpanded: boolean) => {
      if (isExpanded && !expandedFolders.current.includes(itemId)) {
        setNavigationPaneFolderToGet(itemId);
      }
      if (isExpanded) setNavigationPaneTreeExpanded([...navigationPaneTreeExpanded, itemId]);
      else setNavigationPaneTreeExpanded(navigationPaneTreeExpanded.filter((id) => id !== itemId));
    },
    [navigationPaneTreeExpanded]
  );

  const handleNavigationPaneItemSelection = useCallback(
    (_event: React.SyntheticEvent<Element, Event>, itemId: string, isSelected: boolean) => {
      if (isSelected) {
        saveFolder(itemId === NAVIGATION_PANE_TREE_ROOT.id ? "" : itemId);
        setFileListFolderToGet(itemId === NAVIGATION_PANE_TREE_ROOT.id ? "" : itemId);
        if (currentAction === FileBrowserAction.OpenFolder) setConfirmButtonDisabled(false);
      }
    },
    [saveFolder, setConfirmButtonDisabled, currentAction]
  );

  const doConfirm = useCallback(() => {
    const pathItems = selectedFolder.path.slice(1);
    onConfirm(
      pathItems.join(FILE_SEPARATOR) +
        (pathItems[pathItems.length - 1] === nameInputValue ? "" : FILE_SEPARATOR + nameInputValue)
    );
    onClose();
  }, [nameInputValue, onConfirm, onClose, selectedFolder.path]);

  const handleFileListDoubleClick = useCallback(
    (id: string, fileListItemType: string) => {
      if (currentAction === FileBrowserAction.OpenFile) {
        if (fileListItemType === "folder") {
          setFileListFolderToGet(id);
        } else if (fileListItemType === "file") {
          doConfirm();
        }
      } else if (currentAction === FileBrowserAction.OpenFolder) {
        doConfirm();
      }
    },
    [currentAction, doConfirm]
  );

  const handleFileListClick = useCallback(
    (fileListItemIndex: number, fileListItemName: string, fileListItemType: string) => {
      setFileListSelectedIndex(fileListItemIndex);
      if (
        fileListItemType === "file" ||
        (fileListItemType === "folder" && currentAction === FileBrowserAction.OpenFolder)
      ) {
        setNameInputValue(fileListItemName);
        setFileExists(fileListItemName);
        setNameInputErrorMessage("");
        setConfirmButtonDisabled(false);
      }
    },
    [currentAction]
  );

  const handleInputValueChange = useCallback(
    (value: string) => {
      let errorMessage = "";

      if (selectedFolder.folder) {
        if (value !== "") {
          const newValue = (
            value.slice(-PROJECT_FILE_EXTENSION.length).toLowerCase() === PROJECT_FILE_EXTENSION.toLowerCase()
              ? value
              : `${value}${PROJECT_FILE_EXTENSION}`
          ).toLowerCase();
          const fileIndex = selectedFolder.folder.children!.findIndex((item) => item.label.toLowerCase() === newValue);
          if (currentAction === FileBrowserAction.SaveFile) {
            setFileExists(fileIndex !== -1 ? selectedFolder.folder.children![fileIndex]!.label : "");
          } else if (currentAction === FileBrowserAction.OpenFile) {
            errorMessage = fileIndex !== -1 ? "" : `File (${newValue}) does not exist`;
          }
        }
      }

      setNameInputValue(value);
      setNameInputErrorMessage(errorMessage);
      setConfirmButtonDisabled(value === "" || !!errorMessage);
    },
    [currentAction, selectedFolder.folder]
  );

  const handleConfirm = useCallback(() => {
    // In folder action mode, if a folder is selected in the navigation pane, nameInputValue is not required as it is the same
    if (currentAction === FileBrowserAction.SaveFile && fileExists) {
      openDialog({
        name: "ConfirmDialog",
        props: {
          title: "Confirm Save As",
          message: `File "${fileExists}" already exists. Do you want to replace it?`,
          onCancel: () => closeDialog(),
          onOk: () => {
            closeDialog();
            doConfirm();
          },
          okLabel: "Yes"
        }
      });
    } else {
      doConfirm();
    }
  }, [currentAction, fileExists, openDialog, closeDialog, doConfirm]);

  const handleNewPath = useCallback(
    async (path: string) => {
      try {
        await createNavigationPaneFromPath(path);
        setFileListFolderToGet(path);
        saveFolder(path);
      } catch (error) {
        openDialog({
          name: "ErrorMessageDialog",
          props: {
            error: error as APIError,
            onOk: () => closeDialog(),
            title: "Path error"
          }
        });
      }
    },
    [createNavigationPaneFromPath, saveFolder, openDialog, closeDialog]
  );

  // This occurs when a navigation pane folder is expanded
  // Check that the folder is not already in the tree due to processing a saved selected folder
  useEffect(() => {
    if (navigationPaneFolder && !expandedFolders.current.includes(navigationPaneFolder.id)) {
      if (navigationPaneFolder.id === NAVIGATION_PANE_TREE_ROOT.id) setNavigationPaneTree(navigationPaneFolder);
      else setNavigationPaneTree((tree) => constructNewNavigationPaneTree(navigationPaneFolder, tree));
      expandedFolders.current.push(navigationPaneFolder.id);
    }
  }, [navigationPaneFolder]);

  // This occurs when a navigation pane folder is selected or when a file list folder is double clicked in file action mode
  useEffect(() => {
    if (fileListFolder) {
      const pathSplit = fileListFolder.id.split(FILE_SEPARATOR);
      if (pathSplit[pathSplit.length - 1] === "") pathSplit.pop();
      const pathItems =
        fileListFolder.id === NAVIGATION_PANE_TREE_ROOT.id
          ? [NAVIGATION_PANE_TREE_ROOT.id]
          : [NAVIGATION_PANE_TREE_ROOT.id, ...pathSplit];
      setSelectedFolder({ folder: fileListFolder, path: pathItems });
      setNavigationPaneTreeSelectedFolder(fileListFolder.id);
      if (currentAction === FileBrowserAction.OpenFolder) {
        setNameInputValue(pathItems[pathItems.length - 1]!);
        setConfirmButtonDisabled(false);
      }
    }
  }, [fileListFolder, currentAction]);

  // This constructs the paths from the stored selected folder path to create the navigation pane tree
  useEffect(() => {
    const storedSelectedFolder = localStorage.getItem(LocalStorage.FileBrowserSelectedFolder);
    if (storedSelectedFolder) {
      getSelectedFolder(storedSelectedFolder);
    } else {
      setNavigationPaneFolderToGet("");
      setFileListFolderToGet("");
    }
  }, [getSelectedFolder]);

  return {
    confirmButtonDisabled,
    nameInputErrorMessage,
    nameInputValue,
    navigationPaneTree,
    navigationPaneTreeExpanded,
    navigationPaneTreeSelectedFolder,
    fileListSelectedIndex,
    selectedFolder,
    handleConfirm,
    handleFileListClick,
    handleFileListDoubleClick,
    handleInputValueChange,
    handleNavigationPaneItemExpansion,
    handleNavigationPaneItemSelection,
    handleNewPath,
    handlePathPartSelection,
    setCurrentAction,
    setOnClose,
    setOnConfirm
  };
};

export default useFileBrowser;
