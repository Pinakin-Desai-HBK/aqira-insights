import { RefObject } from "react";
import { NumericAxis3D, SciChart3DSurface, TSciChart3D, TWebAssemblyChart3D } from "scichart";
import { DataSet, Range } from "src/redux/types/ui/dashboardVisualization";
import { ActionsInformationDialogParams, CommonParams, VIS_ERROR_TYPES } from "../Shared/types";
import { Histogram3DKey } from "src/redux/types/schemas/dashboardVisualizations";
import { ProcessedChartSurface3DData } from "./chart/processChartSurface3DData";
import { IndexSelectionDetails } from "../Shared/chart/types";
import { ToolbarSetActionsHandlers } from "src/redux/types/ui/toolbar";

export type ChartData = {
  colors: string[];
  indexes: Float64Array;
  indexSelectionDetails: IndexSelectionDetails;
  selectedIndex: number | null;
  xAxisLabel: string;
  yAxisLabel: string;
  zAxisLabel: string;
  xRange: Range | null;
  yRange: Range | null;
  zRange: Range | null;
  dataSetId: string | null;
  refs: ChartRefs | null;
  data: BinData | null;
  allData: HistogramData[];
  allDataMaxZ: number;
  allDataMinZ: number;
  datasetLabels: string[];
  channelNames: string[];
  selectedChannel: string | null;
};

export type StoredChartState = {
  selectedIndex: number;
  selectedChannel: string;
};

export type HistogramContextData = {
  chartData: ChartData;
  refreshActionsRef: RefObject<(() => void) | null>;
  setRef: (element: HTMLDivElement | null) => void;
  setSelectedChannel: (channel: string) => void;
  setSelectedIndex: (selectedIndex: number) => void;
  visError: VIS_ERROR_TYPES | null;
  visMessage: string | null;
};

export type CreateChart = (params: {
  chartElement: HTMLDivElement;
  chartData: ChartData;
  name: string;
  sciChartResult: TWebAssemblyChart3D;
  dashboardId: string;
  visualizationId: string;
  processedChartData: ProcessedChartSurface3DData;
}) => Promise<void>;

export type ChartRefs = {
  chartSurface: SciChart3DSurface;
  xAxis: NumericAxis3D;
  yAxis: NumericAxis3D;
  zAxis: NumericAxis3D;
  wasmContext: TSciChart3D;
};

export type Bin = {
  xStart: number;
  xMidPoint: number;
  xEnd: number;
  yStart: number;
  yMidPoint: number;
  yEnd: number;
  z: number;
};

export type BinData = {
  bins: Bin[];
  xDomain: Range;
  yDomain: Range;
  binWidth: number;
  binDepth: number;
  z: number[];
};

export type GetHistogramData<T extends Histogram3DKey> = (
  params: CommonParams<T> & {
    schema: DataSet<"Histogram3D">;
    queryChannelNames: string[] | null;
    queryIndex: number | null;
    indexes: Float64Array;
  }
) => Promise<{ state: "Loaded"; data: HistogramChartData } | { state: "Loading" } | null>;

export type HistogramChartData = {
  available: {
    channelNames: string[];
    indexes: Float64Array;
  };
  currentIndex: {
    index: number;
    fullXRange: {
      min: number;
      max: number;
    };
    fullYRange: {
      min: number;
      max: number;
    };
    fullZRange: {
      min: number;
      max: number;
    };
    xRange: {
      min: number;
      max: number;
    };
    yRange: {
      min: number;
      max: number;
    };
    zRange: {
      min: number;
      max: number;
    };
    averageBinWidth: number;
    averageBinDepth: number;
    histograms: HistogramData[];
  };
  name: string;
};

export type HistogramData = {
  chanName: string;
  type: "h3axis";
  data: {
    x: {
      start: number;
      midPoint: number;
      end: number;
      label: string;
    }[];
    xUnits: string;
    xLabel: string;
    y: {
      start: number;
      midPoint: number;
      end: number;
      label: string;
    }[];
    yUnits: string;
    yLabel: string;
    z: number[];
    zUnits: string;
    zLabel: string;
  };
};

export type RefreshActionsHandlerParams = {
  key: string;
  dashboardId: string;
  visualizationId: string;
  handlerSetters: ToolbarSetActionsHandlers<
    "DashboardCanvas-ViewModeNode-Histogram3D" | "DashboardCanvas-EditModeNode-Histogram3D"
  > | null;
} & ActionsInformationDialogParams;
