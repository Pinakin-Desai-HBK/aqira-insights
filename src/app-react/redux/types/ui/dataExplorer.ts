import { ForwardRefExoticComponent, MemoExoticComponent, MouseEvent, RefObject, ReactNode } from "react";
import {
  ConvertedColumnDetails,
  DataFileSchema,
  DataFilesSchema,
  NetworkDisplayNodeArraySchema,
  NetworkDisplayNodeSchema,
  NodeSchema
} from "../schemas/dataExplorer";
import { z } from "zod";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { JSX } from "react";

export type FilePath = { filePath: string };

export type Folder = { folder: string };

export type DataFileDetails = {
  dataFileDetails: {
    filename: string;
    filePath: string;
    folder: string;
    created: string;
    size: string;
    modified: string;
  };
};

export type Timestamp = { timestamp: number };

type DataFile = z.infer<typeof DataFileSchema>;

export type DataFiles = z.infer<typeof DataFilesSchema>;

type Node = z.infer<typeof NodeSchema>;

type NetworkDisplayNode = z.infer<typeof NetworkDisplayNodeSchema>;

export type NetworkDisplayNodeArray = z.infer<typeof NetworkDisplayNodeArraySchema>;

export type UseDataExplorerResult = {
  onSearchText: (searchText: string) => void;
  onRefresh: () => void;
  onSort: () => void;
  onSelectFolder: () => void;
  setOpenGroup: (index: number) => void;
};

export type NetworkDisplayNodeItem = { type: "DisplayNode"; item: NetworkDisplayNode; node: Node };

export type DataFileItem = { item: DataFile; type: "DataFile" };

export type DataGroupItem = NetworkDisplayNodeItem | DataFileItem;

// DataGroup Element

export type DataGroupProps<T extends DataGroupItem> = {
  groupItems: T[];
  allGroupItems: T[];
  isOpen: boolean;
  minHeight: string;
  Row: ({ index, style }: { index: number; style: React.CSSProperties }) => JSX.Element | null;
  testId: string;
  listTestId: string;
};

export type DataGroupType<T extends DataGroupItem> = (props: DataGroupProps<T>) => JSX.Element;

export type DataItemProps<T extends DataGroupItem> = {
  index: number;
  style: React.CSSProperties;
  name: string;
  displayName: string;
  icon: JSX.Element;
  testId: string;
  source: T;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, isSelected: boolean) => void;
  onDragEnd?: () => void;
  openMenu: null | ((e: MouseEvent<HTMLDivElement>, source: DataGroupItem) => void);
  createTooltipContent: (props: { closeTooltip: () => void }) => JSX.Element | null;
};

export type DataItemType<T extends DataGroupItem> = MemoExoticComponent<(props: DataItemProps<T>) => JSX.Element>;

export type DataGroupHeaderProps = {
  isOpen: boolean;
  title: string;
  setOpenGroup: () => void;
  testId: string;
};

export type DataGroupHeaderType = (props: DataGroupHeaderProps) => JSX.Element;

export type DataDraggableProps = { color: string; dragging: boolean; name: string; icon: JSX.Element };

export type DataDraggableType = ForwardRefExoticComponent<DataDraggableProps & React.RefAttributes<HTMLDivElement>>;

export type DataExplorerOptionsProps = {
  onRefresh: () => void;
  onSelectFolder: () => void;
  onSort: () => void;
  showSelectFolder: boolean;
};

export type DataExplorerOptionButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  id: string;
  onClick: () => void;
};

export type SelectionContextProviderProps<T> = UseSelectionContextProps<T> & {
  children: JSX.Element;
};

export type SelectionContextAction<T> =
  | {
      type: "setAllItems";
      payload: { allItems: T[]; matcher?: MatcherType<T> };
    }
  | {
      type: "setItems";
      payload: { items: T[] };
    }
  | {
      type: "initialise";
      payload: { location: string; enabled: boolean };
    }
  | {
      type: "selectItem";
      payload: { index: number; shiftKey: boolean; ctrlKey: boolean };
    };

export type SelectionItem<T> = { item: T; selected: boolean };

export type SelectionContextType<T> = {
  selectionStart: number | null;
  itemsRaw: T[];
  allItemsRaw: T[];
  items: SelectionItem<T>[];
  allItems: SelectionItem<T>[];
  location: string | null;
  enabled: boolean;
  matcher?: MatcherType<T> | undefined;
};

export type MatcherType<T> = (itemA: SelectionItem<T>, itemB: SelectionItem<T>) => boolean;

export type SelectionContextData<T> = SelectionContextType<T> & {
  dispatch: React.Dispatch<SelectionContextAction<T>>;
  getSelectedItems: () => T[] | null;
  isMultipleSelected: (draggedItem: SelectionItem<T> | undefined) => boolean;
  getSelectedItemCount: (draggedItem: SelectionItem<T> | undefined) => number;
  matcher: MatcherType<T>;
};

export type UseSelectionContextProps<T> = {
  enabled: boolean;
  location: string;
  matcher: MatcherType<T>;
};

export type UseSelectionContextType = <T>(props: UseSelectionContextProps<T>) => SelectionContextData<T>;

type ApiRef<T extends GridType> = T extends "dataColumns"
  ? {
      api: GridApiCommunity;
      type: T;
      indexDetails: ConvertedColumnDetails["index"];
    }
  : {
      api: GridApiCommunity;
      type: T;
    };

export type ApiRefs = ApiRef<GridType>[];

export type GridType = "columnsHeader" | "dataColumns" | "scroller";

type ColumnDetailsGridParamsBase<T extends GridType> = {
  apiRefs: RefObject<ApiRefs>;
  currentIndex: number;
  unitValues: string[];
  typeValues: string[];
  maxNameWidth: number;
  type: T;
};

export type ColumnDetailsGridParams<T extends GridType> = T extends "dataColumns"
  ? ColumnDetailsGridParamsBase<T> & {
      columnDetails: ConvertedColumnDetails;
    }
  : ColumnDetailsGridParamsBase<T>;

type UseGridSyncPropsBase<T extends GridType> = {
  apiRefs: RefObject<ApiRefs>;
  currentIndex: number;
  type: T;
  apiRef: React.RefObject<GridApiCommunity>;
};

export type UseGridSyncProps<T extends GridType> = T extends "dataColumns"
  ? UseGridSyncPropsBase<T> & {
      indexDetails: ConvertedColumnDetails["index"];
    }
  : UseGridSyncPropsBase<T>;
