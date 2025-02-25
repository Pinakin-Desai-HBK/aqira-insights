import { ChartData } from "../../../types";

export const emptyChartData = (): ChartData => ({
  resizeObserver: null,
  numtraces: 0,
  range: null,
  fullRange: { min: 0, max: 1 },
  dataSetId: null,
  datasetLabels: [],
  chartColumns: [],
  minimapChartColumns: [],
  chartSurface: null,
  overview: null,
  wasmContext: null,
  minimapXySeriesArray: [],
  xySeriesArray: [],
  xAxisLabel: "",
  yAxisLabel: ""
});
