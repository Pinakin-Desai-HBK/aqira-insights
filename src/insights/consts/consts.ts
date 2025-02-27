import { VisualizationDetailsContextProvider } from "src/insights/components/dashboard-visualization/VisualizationDetailsContextProvider";
import NetworkEdge from "src/insights/components/workspace-canvas/network/edge/NetworkEdge";
import NetworkNode from "src/insights/components/workspace-canvas/network/node/NetworkNode";
import {
  HistogramTableAxis,
  HistogramTableInfo,
  TableData,
  TablePaginationData
} from "src/insights/redux/types/ui/table";

export const appTitle = "Advantage Insights";

export const PROJECT_FILE_EXTENSION = ".apj";

export const TOAST_DELAY = 3000;

export const TOAST_REDUCED_DELAY = 1000;

export const MAX_TIME_SERIES_TRACES = 32;

export const LOG_MESSAGES_LIMIT = 1000;

export const NETWORK_INPUT_NODE = "Input";

export const NETWORK_DATA_FRAME_CONNECTOR_NODE = "DataFrameConnector";

export const NETWORK_CONNECTION_FILE_PREFIX = "dsfile://File.Filename=";

export const DASHBOARD_CONNECTION_FILE_PREFIX = "aadisplay://Network=";

export const dashboardReactFlowTypes = { aiVisualization: VisualizationDetailsContextProvider };

export const networkReactFlowTypes = { aiNode: NetworkNode };

export const networkReactFlowEdgeTypes = { aiEdge: NetworkEdge };

export const NetworkPaletteItemSize = 75;

export const DASHBOARD_SNAP_INTERVAL = 20;

export const DashboardPaletteItemSize = 75;

export const DATA_EXPLORER_ROW_HEIGHT = 30;

export const DATA_EXPLORER_ROW_HEADER_TEXT_HEIGHT = 30;

export const TABLE_VIS_HEADER_CLASS_NAME = "header";

export const TABLE_VIS_HEADER_FONT = "bold 14px Roboto";

export const TABLE_VIS_HEADER_FONT_CALC = "bold 16px Roboto";

export const TABLE_VIS_DEFAULT_COLUMN_WIDTH = 150;

// Colour ranges generated in https://colordesigner.io/gradient-generator

const TIME_SERIES_RANGE = [
  "#f5843d",
  "#f5c93d",
  "#dcf53d",
  "#97f53d",
  "#53f53d",
  "#3df56c",
  "#3df5b1",
  "#3df4f5",
  "#3daff5",
  "#3d6af5",
  "#553df5",
  "#9a3df5",
  "#de3df5",
  "#f53dc7",
  "#f53d82",
  "#f53d3d"
];

const indexes = [8, 0, 3, 14, 9, 1, 11, 6, 15, 10, 2, 12, 5, 7, 13, 4];
export const CURRENT_TIME_SERIES_COLORS = indexes.map((i) => TIME_SERIES_RANGE[i]);

export const COLUMN_DEFINITIONS_HEADER_FONT = "bold 14px Roboto";
export const COLUMN_DEFINITIONS_HEADER_FONT_CALC = "bold 16px Roboto";
export const COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH = 100;
export const COLUMN_DEFINITIONS_COPY_COLUMN_ICON_WIDTH = 28;

export const defaultTablePaginationData: TablePaginationData = {
  firstItemIndex: 0,
  lastItemIndex: 0,
  nextisEnabled: false,
  prevIsEnabled: false,
  totalNumberOfItems: 0,
  onPageChange: () => ({})
};

export const defaultTableData: TableData = {
  dataSetId: null,
  pageNumber: 1,
  rowsPerPage: 0,
  tableColumns: [],
  tableRows: []
};

export const defaultHistogramTableInfo: HistogramTableInfo = {
  axis: "h2axis" as HistogramTableAxis,
  channelNames: [],
  indexes: new Float64Array(),
  selectedChannel: "",
  selectedIndex: 0,
  marksData: { marks: [], min: 0, max: 0 },
  maxMarkCharacters: 0,
  setSelectedChannel: () => ({}),
  setSelectedIndex: () => ({})
};
