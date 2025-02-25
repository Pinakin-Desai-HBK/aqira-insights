import { Dimensions } from "src/redux/types/redux/workspaces";
import { ChartData, HistogramData, HistogramChartData, Bin } from "../../../../types";
import { IndexSelectionDetails } from "src/components/dashboard-visualization/components/Shared/chart/types";
import { getIndexSelectDetails } from "src/components/dashboard-visualization/components/Shared/chart/getIndexSelectDetails";

const prepareSelectedHistogram = (histograms: HistogramData[], selectedChannel: string | null) => {
  const histogram =
    (selectedChannel ? histograms.find((histogram) => histogram.chanName === selectedChannel) : histograms[0]) ||
    histograms[0];
  if (!histogram) return null;

  const xRange = histogram.data.x.reduce(
    (acc, { midPoint }) => {
      return {
        min: Math.min(acc.min, midPoint),
        max: Math.max(acc.max, midPoint)
      };
    },
    { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
  );
  const yRange = histogram.data.y.reduce(
    (acc, { midPoint }) => {
      return {
        min: Math.min(acc.min, midPoint),
        max: Math.max(acc.max, midPoint)
      };
    },
    { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
  );
  const zRange = histogram.data.z.reduce(
    (acc, z) => {
      return {
        min: Math.min(acc.min, z),
        max: Math.max(acc.max, z)
      };
    },
    { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
  );
  const {
    data: { x, xLabel, xUnits, y, yLabel, yUnits, z, zLabel, zUnits },
    chanName
  } = histogram;

  const bins: Bin[] = x.reduce((acc, xBin, ix) => {
    return [
      ...acc,
      ...y.map((yBin, iy) => ({
        xStart: xBin.start,
        xMidPoint: xBin.midPoint,
        xEnd: xBin.end,
        yStart: yBin.start,
        yMidPoint: yBin.midPoint,
        yEnd: yBin.end,
        z: z[ix * y.length + iy] ?? 0
      }))
    ];
  }, [] as Bin[]);
  const data = {
    bins,
    z,
    xDomain: {
      min: x[0]!.start,
      max: x[x.length - 1]!.end
    },
    yDomain: {
      min: y[0]!.start,
      max: y[y.length - 1]!.end
    },
    binWidth: (x[x.length - 1]!.end - x[0]!.start) / x.length, // x.reduce((acc, { start, end }) => acc + (end - start), 0) / x.length
    binDepth: (y[y.length - 1]!.end - y[0]!.start) / y.length
  };

  const datasetLabels = x.map((d) => d.label);
  return {
    xAxisLabel: `${xLabel} ${xUnits}`,
    yAxisLabel: `${yLabel} ${yUnits}`,
    zAxisLabel: `${zLabel} ${zUnits}`,
    data,
    xRange,
    yRange,
    zRange,
    datasetLabels,
    selectedChannel: chanName
  };
};

export const prepareChartData = ({
  histogramChartData,
  dataSetId,
  storedSelectedChannel,
  dimensions,
  colors
}: {
  histogramChartData: HistogramChartData | null;
  dataSetId: string;
  storedSelectedChannel: string | null;
  dimensions: Dimensions | null;
  colors: string[];
}): Omit<ChartData, "refs"> | null => {
  if (!histogramChartData) return null;
  const {
    currentIndex: { histograms, index: selectedIndex },
    available: { indexes }
  } = histogramChartData;

  const selectedHistogram = prepareSelectedHistogram(histograms, storedSelectedChannel || null);
  if (!selectedHistogram || !dimensions) return null;

  const indexSelectionDetails: IndexSelectionDetails = getIndexSelectDetails({ dimensions, indexes });
  return {
    colors,
    indexSelectionDetails,
    allData: histograms,
    allDataMaxZ: Math.max(...histograms.map((d) => Math.max(...d.data.z))),
    allDataMinZ: Math.max(...histograms.map((d) => Math.min(...d.data.z))),
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
