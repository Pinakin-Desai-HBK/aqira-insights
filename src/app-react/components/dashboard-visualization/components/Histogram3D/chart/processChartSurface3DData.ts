import { parseColorToUIntArgb, TSciChart3D, XyzDataSeries3D } from "scichart";
import { BinData } from "../types";
import { getColorFromGradient, getGradient } from "./colourInterpolation";

export type ProcessedChartSurface3DData = {
  ranges: {
    x: {
      min: number;
      max: number;
    };
    y: {
      min: number;
      max: number;
    };
    z: {
      min: number;
      max: number;
    };
  };
  dataSeries: XyzDataSeries3D;
};

export const processChartSurface3DData = ({
  wasmContext,
  binData,
  colors
}: {
  wasmContext: TSciChart3D;
  binData: BinData;
  colors: string[];
}): ProcessedChartSurface3DData => {
  const ranges: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  } = {
    x: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    y: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    z: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  };
  //const binWidth = histograms[0]?.data ? histograms[0].data.binWidth : 1;

  binData.bins.map((bin) => {
    ranges.x.min = Math.min(ranges.x.min, bin.xStart);
    ranges.x.max = Math.max(ranges.x.max, bin.xEnd);
    ranges.y.min = Math.min(ranges.y.min, bin.z);
    ranges.y.max = Math.max(ranges.y.max, bin.z);
    ranges.z.min = Math.min(ranges.z.min, bin.yStart);
    ranges.z.max = Math.max(ranges.z.max, bin.yEnd);
  });

  const rawXValues = binData.bins.map((bin) => bin.xMidPoint);
  const rawYValues = binData.bins.map((bin) => bin.z);
  const rawZValues = binData.bins.map((bin) => bin.yMidPoint);

  const gradientRange = 255.0;
  const gradient = getGradient(colors, gradientRange);

  const dataSeries = new XyzDataSeries3D(wasmContext, {
    xValues: rawXValues,
    yValues: rawYValues,
    zValues: rawZValues,
    metadata: rawYValues.map((y) => {
      if (y === 0) {
        return { vertexColor: "transparent" as unknown as number, pointScale: 0 };
      }
      const col = getColorFromGradient(y, ranges.y.max, gradient, gradientRange);
      const alpha = col[3]! / 255;
      const vertexColor = parseColorToUIntArgb(
        `rgba(${col[0]!},${col[1]!},${col[2]!},${alpha < 0 ? 0 : alpha > 1 ? 1 : alpha})`
      );
      return { vertexColor };
    })
  });

  return {
    ranges,
    dataSeries
  };
};
