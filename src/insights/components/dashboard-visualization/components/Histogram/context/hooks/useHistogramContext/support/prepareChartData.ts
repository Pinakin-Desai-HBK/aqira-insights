import { Dimensions } from "src/insights/redux/types/redux/workspaces";
import { ChartData, HistogramData, HistogramChartData } from "../../../../types";
import { IndexSelectionDetails } from "src/insights/components/dashboard-visualization/components/Shared/chart/types";
import { getIndexSelectDetails } from "src/insights/components/dashboard-visualization/components/Shared/chart/getIndexSelectDetails";

const prepareSelectedHistogram = (histograms: HistogramData[], selectedChannel: string | null) => {
  const histogram =
    (selectedChannel ? histograms.find((histogram) => histogram.chanName === selectedChannel) : histograms[0]) ||
    histograms[0];
  if (!histogram) return null;

  const range = histogram.data.x.reduce(
    (acc, { start, end }) => {
      return {
        min: Math.min(acc.min, start),
        max: Math.max(acc.max, end)
      };
    },
    { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
  );
  const {
    data: { x, xLabel, xUnits, y, yLabel, yUnits },
    chanName
  } = histogram;

  const data = {
    bins: x.map((bin, i) => ({
      ...bin,
      y: y[i]!
    })),
    y,
    xDomain: {
      min: x[0]!.start,
      max: x[x.length - 1]!.end
    },
    binWidth: (x[x.length - 1]!.end - x[0]!.start) / x.length // x.reduce((acc, { start, end }) => acc + (end - start), 0) / x.length
  };

  const datasetLabels = x.map((d) => d.label);
  return {
    xAxisLabel: `${xLabel} ${xUnits}`,
    yAxisLabel: `${yLabel} ${yUnits}`,
    data,
    range,
    datasetLabels,
    selectedChannel: chanName
  };
};

export const prepareChartData = ({
  histogramChartData,
  dataSetId,
  storedSelectedChannel,
  dimensions
}: {
  histogramChartData: HistogramChartData | null;
  dataSetId: string;
  storedSelectedChannel: string | null;
  dimensions: Dimensions | null;
}): Omit<ChartData, "refs"> | null => {
  if (!histogramChartData) return null;
  const {
    currentIndex: { range: fullRange, histograms, index: selectedIndex },
    available: { indexes }
  } = histogramChartData;

  const selectedHistogram = prepareSelectedHistogram(histograms, storedSelectedChannel || null);
  if (!selectedHistogram || !dimensions) return null;

  const indexSelectionDetails: IndexSelectionDetails = getIndexSelectDetails({ dimensions, indexes });
  return {
    indexSelectionDetails,
    fullRange,
    allData: histograms,
    allDataMaxY: Math.max(...histograms.map((d) => Math.max(...d.data.y))),
    allDataMinY: Math.max(...histograms.map((d) => Math.min(...d.data.y))),
    channelNames: histograms.map((d) => d.chanName),
    dataSetId,
    indexes,
    selectedIndex,
    ...selectedHistogram
  };
};

export const updateSelectedChannel = (
  chartData: ChartData,
  selectedChannel: string | null
): Partial<ChartData> | null => {
  const selectedHistogram = prepareSelectedHistogram(chartData.allData, selectedChannel);
  if (!selectedHistogram) return null;
  return selectedHistogram;
};
