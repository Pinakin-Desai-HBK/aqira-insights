import { ErrorDetails } from "src/redux/api/utils/responseValidator";
import { GetColumnDetailsDataResponse, GetColumnDetailsResponse } from "../schemas/dataExplorer";
import { Workspace } from "../schemas/project";
import { DataFileItem, NetworkDisplayNodeItem } from "../ui/dataExplorer";

export type UIDataPanelSlice = {
  showDataPanel: boolean;
  folder: string;
  noFilteredDataFiles: boolean;
  noFilteredDisplayNodes: boolean;
  noDataFilesInFolder: boolean;
  dataFiles: DataFileItem[];
  displayNodes: NetworkDisplayNodeItem[];
  initialDataFiles: DataFileItem[];
  initialDisplayNodes: NetworkDisplayNodeItem[];
  openGroup: number;
  searchText: string;
  sort: "ascending" | "descending";
  lastTab: Workspace | null;
  folderChangeTimestamp: number;
  columnDetails: {
    apiError: ErrorDetails | null;
    error: string | null;
    data: string | null;
    id: string | null;
    dataStatus: GetColumnDetailsDataResponse["status"] | null;
    status: GetColumnDetailsResponse["status"] | null;
  };
  dragAndDrop: DragAndDropDetails;
};

export type DragAndDropDetails = {
  dragging: "File" | "DisplayNode" | null;
  count: number;
};
