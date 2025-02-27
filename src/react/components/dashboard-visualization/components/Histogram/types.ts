import {
  FastColumnRenderableSeries,
  FastLineRenderableSeries,
  NumberRange,
  NumericAxis,
  SciChartOverview,
  SciChartSurface,
  TSciChart,
  TWebAssemblyChart
} from "scichart";
import { DataSet, Range } from "src/react/redux/types/ui/dashboardVisualization";
import { ToolbarSetActionsHandlers } from "src/react/redux/types/ui/toolbar";
import { ActionsInformationDialogParams, CommonParams, VIS_ERROR_TYPES } from "../Shared/types";
import { HistogramKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import { RefObject } from "react";
import { IndexSelectionDetails } from "../Shared/chart/types";

export type UpdateMode = (mode: HistogramMode) => void;
export type UpdateScaleType = (scaleType: ScaleType) => void;
export type UpdateTickType = (tickType: "center" | "bounds") => void;
export type UpdateTooltipsEnabled = (tooltipsEnabled: boolean) => void;

export type RefreshActionsHandlerParams = {
  key: string;
  updateMode: UpdateMode;
  updateScaleType: UpdateScaleType;
  updateTickType: UpdateTickType;
  updateTooltipsEnabled: UpdateTooltipsEnabled;
  updateShowMinimap: (showMinimap: boolean) => void;
  resetZoom: () => void;
  isZoomed: () => boolean;
  dashboardId: string;
  visualizationId: string;
  handlerSetters: ToolbarSetActionsHandlers<
    "DashboardCanvas-ViewModeNode-Histogram" | "DashboardCanvas-EditModeNode-Histogram"
  > | null;
} & ActionsInformationDialogParams;

export type ChartData = {
  indexes: Float64Array;
  indexSelectionDetails: IndexSelectionDetails;
  selectedIndex: number | null;
  xAxisLabel: string;
  yAxisLabel: string;
  range: Range | null;
  fullRange: Range;
  dataSetId: string | null;
  refs: ChartRefs | null;
  data: BinData | null;
  allData: HistogramData[];
  allDataMaxY: number;
  allDataMinY: number;
  datasetLabels: string[];
  channelNames: string[];
  selectedChannel: string | null;
};

export type HistogramMode = "showBins" | "showLines" | "showLinesAndPoints";

export type StoredChartState = {
  mode: HistogramMode;
  scaleType: ScaleType;
  tickType: "center" | "bounds";
  selectedChannel: string;
  selectedIndex: number;
  tooltipsEnabled: boolean;
  showMinimap: boolean;
  zoomRange: NumberRange | null;
};

export type HistogramContextData = {
  chartData: ChartData;
  refreshActionsRef: RefObject<(() => void) | null>;
  setRef: (element: HTMLDivElement | null) => void;
  setMinimapRef: (element: HTMLDivElement | null) => void;
  setSelectedChannel: (channel: string) => void;
  setSelectedIndex: (selectedIndex: number) => void;
  visError: VIS_ERROR_TYPES | null;
  visMessage: string | null;
};

export type ScaleType = "linear" | "logarithmic";

export type TickType = "center" | "bounds";

export type CreateChart = (params: {
  chartElement: HTMLDivElement;
  minimapElement: HTMLDivElement;
  chartData: ChartData;
  name: string;
  sciChartResult: TWebAssemblyChart;
  dashboardId: string;
  visualizationId: string;
}) => Promise<void>;

export type CreateChartSurface = (params: { sciChartResult: TWebAssemblyChart }) => SciChartSurface;

export type ChartRefs = {
  chartSurface: SciChartSurface;
  columnSeries: FastColumnRenderableSeries;
  lineSeries: FastLineRenderableSeries;
  pointSeries: FastLineRenderableSeries;
  overviewColumnSeries: FastColumnRenderableSeries;
  overviewLineSeries: FastLineRenderableSeries;
  overviewPointSeries: FastLineRenderableSeries;
  xAxis: NumericAxis;
  yAxis: NumericAxis;
  wasmContext: TSciChart;
  overview: SciChartOverview;
};

export type Bin = {
  start: number;
  midPoint: number;
  end: number;
  y: number;
};

type BinData = {
  bins: Bin[];
  xDomain: Range;
  binWidth: number;
  y: number[];
};

export type GetHistogramData<T extends HistogramKey> = (
  params: CommonParams<T> & {
    schema: DataSet<"Histogram">;
    queryChannelNames: string[] | null;
    queryIndex: number | null;
    indexes: Float64Array;
  }
) => Promise<{ state: "Loaded"; data: Omit<HistogramChartData, "zoomRange"> } | { state: "Loading" } | null>;

export type HistogramChartData = {
  available: {
    channelNames: string[];
    indexes: Float64Array;
  };
  currentIndex: {
    index: number;
    range: {
      min: number;
      max: number;
    };
    averageBinWidth: number;
    histograms: HistogramData[];
  };
  name: string;
  zoomRange: Range | null;
};

export type ChartSeries = {
  columnSeries: FastColumnRenderableSeries;
  lineSeries: FastLineRenderableSeries;
  pointSeries: FastLineRenderableSeries;
};

// All numbers supplied as Base64 double encoded strings
export type HistogramData = {
  chanName: string;
  type: "h2axis";
  data: {
    x: {
      start: number;
      midPoint: number;
      end: number;
      label: string;
    }[];
    xUnits: string;
    xLabel: string;
    y: number[];
    yUnits: string;
    yLabel: string;
  };
};
