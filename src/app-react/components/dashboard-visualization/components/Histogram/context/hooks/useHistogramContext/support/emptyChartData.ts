import { ChartData } from "../../../../types";

export const emptyChartData = (): ChartData => ({
  range: null,
  fullRange: { min: 0, max: 1 },
  dataSetId: null,
  datasetLabels: [],
  refs: null,
  xAxisLabel: "",
  yAxisLabel: "",
  data: null,
  allData: [],
  allDataMaxY: 0,
  allDataMinY: 0,
  channelNames: [],
  selectedChannel: null,
  selectedIndex: null,
  indexes: new Float64Array(0),
  indexSelectionDetails: {
    maxWidth: 0
  }
});
