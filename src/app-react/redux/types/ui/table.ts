import { GridColDef } from "@mui/x-data-grid";
import { MarksData } from "src/components/dashboard-visualization/components/Shared/chart/types";
import { JSX } from "react";

export type TablePageChangeType = "first" | "last" | "next" | "prev";

export type TablePaginationData = {
  firstItemIndex: number;
  lastItemIndex: number;
  nextisEnabled: boolean;
  prevIsEnabled: boolean;
  totalNumberOfItems: number;
  onPageChange: (pageChangeType: TablePageChangeType) => void;
};

export type TableColumnData = {
  type: Required<GridColDef>["type"];
  field: string;
  headerName: string;
  minWidth: number;
  headerClassName: string;
  flex: number;
  cellClassName?: string;
  renderHeader: () => JSX.Element;
};

export type TableData = {
  dataSetId: string | null | undefined;
  pageNumber: number;
  rowsPerPage: number;
  tableColumns: TableColumnData[];
  tableRows: Record<string, unknown>[];
};

export type HistogramTableAxis = "h2axis" | "h3axis";

export type HistogramTableInfo = {
  axis: HistogramTableAxis;
  channelNames: string[];
  indexes: Float64Array;
  selectedChannel: string;
  selectedIndex: number | null;
  marksData: MarksData;
  maxMarkCharacters: number;
  setSelectedChannel: (channel: string) => void;
  setSelectedIndex: (index: number) => void;
};

export type HistogramTableFooterProps = {
  histogramTableInfo: HistogramTableInfo;
};

export type HistogramTableHeaderProps = {
  histogramTableInfo: HistogramTableInfo;
};
