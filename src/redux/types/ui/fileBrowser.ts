import { Timestamp } from "./dataExplorer";

export type GetFolderContentsParams = {
  folder: string;
  contentType: FileSystemContentType;
  contentFileFilter: FileSystemContentFileFilter;
} & Timestamp;

import { TreeViewBaseItem } from "@mui/x-tree-view";
import { FileDialogParams } from "./dialogs";

export enum FileBrowserAction {
  OpenFile = "OpenFile",
  OpenFolder = "OpenFolder",
  SaveFile = "SaveFile"
}

export enum FileSystemItemType {
  File = "File",
  Folder = "Folder",
  Drive = "Drive"
}

export enum FileSystemContentType {
  Both = "Both",
  File = "File",
  Folder = "Folder"
}

export enum FileSystemContentFileFilter {
  DataExplorer = "DataExplorer",
  Project = "Project",
  Python = "Python"
}

export type UseFileBrowserData = {
  confirmButtonDisabled: boolean;
  nameInputErrorMessage: string;
  nameInputValue: string;
  navigationPaneTree: TreeViewBaseItem;
  navigationPaneTreeExpanded: string[];
  navigationPaneTreeSelectedFolder: string;
  fileListSelectedIndex: number;
  selectedFolder: { folder: TreeViewBaseItem; path: string[] };
  handleConfirm: () => void;
  handleFileListClick: (index: number, name: string, type: string) => void;
  handleFileListDoubleClick: (id: string, type: string) => void;
  handleInputValueChange: (value: string) => void;
  handleNavigationPaneItemExpansion: (
    _event: React.SyntheticEvent<Element, Event>,
    itemId: string,
    isExpanded: boolean
  ) => void;
  handleNavigationPaneItemSelection: (
    _event: React.SyntheticEvent<Element, Event>,
    itemId: string,
    isSelected: boolean
  ) => void;
  handleNewPath: (path: string) => void;
  handlePathPartSelection: (pathPartIndex: number) => void;
  setCurrentAction: React.Dispatch<React.SetStateAction<FileBrowserAction>>;
  setOnClose: React.Dispatch<React.SetStateAction<() => void>>;
  setOnConfirm: React.Dispatch<React.SetStateAction<(path: string) => void>>;
};

export type UseFileSystemData = {
  folder: TreeViewBaseItem | undefined;
};

export type FileBrowserAddressBarProps = {
  selectedFolder: { folder: TreeViewBaseItem; path: string[] };
  handleNewPath: (path: string) => void;
  handlePathPartSelection: (pathPartIndex: number) => void;
};

export type FileBrowserNavigationPaneProps = {
  items: TreeViewBaseItem;
  expandedItems: string[];
  selectedItems: string;
  handleItemExpansion: (_event: React.SyntheticEvent<Element, Event>, itemId: string, isExpanded: boolean) => void;
  handleItemSelection: (_event: React.SyntheticEvent<Element, Event>, itemId: string, isExpanded: boolean) => void;
};

export type FileBrowserFileListProps = {
  selectedIndex: number;
  selectedFolder: { folder: TreeViewBaseItem; path: string[] };
  handleClick: (index: number, name: string, type: string) => void;
  handleDoubleClick: (id: string, type: string) => void;
};

export type FileBrowserNameInputProps = {
  errorMessage: string;
  label: string;
  value: string;
  handleConfirm: () => void;
  onChange: (value: string) => void;
};

export type DialogFileBrowserParams = UseFileBrowserData & FileDialogParams;
