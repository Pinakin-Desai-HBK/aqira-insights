import { RefObject } from "react";
import { NumberRange, SciChartOverview, SciChartSurface, TSciChart, XyDataSeries } from "scichart";
import { DataRange } from "src/redux/types/schemas/data";
import {
  DataSet,
  DataSetId,
  DataVisTypes,
  FilteredVisualizationProperties,
  Range
} from "src/redux/types/ui/dashboardVisualization";
import { ToolbarSetActionsHandlers } from "src/redux/types/ui/toolbar";
import { CommonParams, VIS_ERROR_TYPES } from "../Shared/types";
import { Dimensions } from "src/redux/types/redux/workspaces";
import { TimeSeriesKey } from "src/redux/types/schemas/dashboardVisualizations";

export type ElementRefs = {
  ref: RefObject<HTMLDivElement | null>;
  minimapRef: RefObject<HTMLDivElement | null>;
  legendRef: RefObject<HTMLDivElement | null>;
};

export type UseRefreshActionsParams = {
  resetZoom: () => void;
  setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void;
};

export type RefreshActionsParams = {
  key: string;
  chartData: ChartData;
  resetZoom: () => void;
  handlerSetters: ToolbarSetActionsHandlers<
    "DashboardCanvas-ViewModeNode-TimeSeries" | "DashboardCanvas-EditModeNode-TimeSeries"
  > | null;
};

export type UpdateStoredHiddenColumns = (params: {
  chart: SciChartSurface;
  dataSetId: string;
  setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void;
}) => void;

type LineChartDataSeries = { x: Float64Array; y: Float64Array };

type LineChartDataSetData = {
  index: {
    name: string;
    units: string;
    type: "Double" | "Integer";
    dataBase64: string;
  };
  columns: {
    name: string;
    units: string;
    type: "Double" | "Integer";
    dataBase64: string;
  }[];
};

export type ProcessDataSet = (props: {
  dataResult: LineChartDataSetData;
  columnNames: string[];
  dataSetId: string;
  range: Range | null;
}) => LineChartData[] | null;

export type LineChartData = {
  data: LineChartDataSeries;
  label: string;
  min: number;
  max: number;
  dataSetId: string;
};

export type RequestAndPrepareColumnData = (
  params: CommonParams<"TimeSeries"> & {
    dataRange: DataRange | null;
    pointCount: number;
  }
) => Promise<LineChartData[] | null>;

export type LineChartDataWithColor = LineChartData & { color: string };

export type RefreshColumnData<T extends DataVisTypes> = (
  params: CommonParams<T> & {
    width: number;
    range: Range;
  }
) => Promise<LineChartDataWithColor[] | null>;

export type RefreshColumns = (params: {
  range: Range;
  dataSetId: string;
  datasetLabels: string[];
  dashboardId: string;
  visualizationId: string;
  dimensions: Dimensions;
  properties: FilteredVisualizationProperties<TimeSeriesKey>;
}) => Promise<{ chartColumnsWithUpdatedLabels: LineChartDataWithColor[] } | null>;

export type RefreshColmnsHandler = (params: {
  range: Range;
  dataSetId: string;
  datasetLabels: string[];
}) => Promise<{ chartColumnsWithUpdatedLabels: LineChartDataWithColor[] } | null>;

export type FetchColumnData = (
  params: DataSetId & {
    visibleRange: NumberRange | Range | null;
    dashboardId: string;
    visualizationId: string;
    dimensions: Dimensions;
    properties: FilteredVisualizationProperties<TimeSeriesKey>;
    schema: DataSet<"TimeSeries">;
    name: string;
  }
) => Promise<
  | {
      state: "Loaded";
      data: {
        chartProps: {
          xAxisLabel: string;
          yAxisLabel: string;
          xLimits: Range;
          name: string;
        };
        datasetLabelsData: string[];
        chartColumnsWithUpdatedLabels: LineChartDataWithColor[];
        minimapColumns: LineChartDataWithColor[];
      };
    }
  | { state: "Loading" }
  | null
>;

export type HiddenColumnsKey = `${string}-${string}`;

export type HiddenColumnsMap = Record<HiddenColumnsKey, boolean>;

export type StoredChartState = {
  range: Range | null;
  showMarkers: boolean;
  hiddenColumns: HiddenColumnsMap;
  tooltipsEnabled: boolean;
  showMinimap: boolean;
};

export type TimeSeriesContextData = {
  chartData: ChartData;
  refreshActionsRef: RefObject<(() => void) | null>;
  visError: VIS_ERROR_TYPES | null;
  visMessage: string | null;
  ref: RefObject<HTMLDivElement | null>;
  minimapRef: RefObject<HTMLDivElement | null>;
  legendRef: RefObject<HTMLDivElement | null>;
};

export type GetColumnData<T extends DataVisTypes> = (
  params: CommonParams<T> & {
    width: number;
    visibleRange: NumberRange | Range | null;
  }
) => Promise<
  | {
      state: "Loaded";
      data: {
        chartColumns: LineChartDataWithColor[];
        xLimits: Range;
        minimapColumns: LineChartDataWithColor[];
      };
    }
  | { state: "Loading" }
  | null
>;

export type ChartData = {
  resizeObserver: ResizeObserver | null;
  numtraces: number;
  xAxisLabel: string;
  yAxisLabel: string;
  range: Range | null;
  fullRange: Range;
  dataSetId: string | null;
  datasetLabels: string[];
  chartColumns: LineChartDataWithColor[];
  minimapChartColumns: LineChartDataWithColor[];
  chartSurface: SciChartSurface | null;
  wasmContext: TSciChart | null;
  overview: SciChartOverview | null;
  xySeriesArray: XyDataSeries[];
  minimapXySeriesArray: XyDataSeries[];
};
