import { DefaultColorBand } from "../../../../chart/colourInterpolation";
import { ChartData } from "../../../../types";

export const emptyChartData = (): ChartData => ({
  colors: DefaultColorBand,
  xRange: null,
  yRange: null,
  zRange: null,
  dataSetId: null,
  datasetLabels: [],
  refs: null,
  xAxisLabel: "",
  yAxisLabel: "",
  zAxisLabel: "",
  data: null,
  allData: [],
  allDataMaxZ: 0,
  allDataMinZ: 0,
  channelNames: [],
  selectedChannel: null,
  selectedIndex: null,
  indexes: new Float64Array(0),
  indexSelectionDetails: {
    maxWidth: 0
  }
});
