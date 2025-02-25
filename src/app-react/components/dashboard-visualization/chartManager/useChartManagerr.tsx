import { useMemo } from "react";
import {
  AxisBase2D,
  IRenderableSeries,
  RolloverModifier,
  SciChart3DSurface,
  SciChartSurface,
  SciChartVerticalGroup
} from "scichart";
import { CustomYTickProvider } from "../components/Histogram/chart/prepare/createChart/support/customProviders/CustomYTickProvider";

type ChartReference = {
  surface?: SciChartSurface;
  surface3D?: SciChart3DSurface;
  id: string;
};

type AppChartManager = {
  addChart: (chart: ChartReference) => void;
  removeChart: (id: string) => void;
  getChart: (id: string) => ChartReference | null;
  getXAxis: (id: string) => AxisBase2D | null;
  getSeries: (id: string, seriesIndex: number) => IRenderableSeries | null;
  getXAxisZoomLevel: (id: string) => number | null;
  getNumberOfSeries: (id: string) => number | null;
  getFullScaleXMin: (id: string) => number | null;
  getFullScaleXMax: (id: string) => number | null;
  getVisibleScaleXMin: (id: string) => number | null;
  getVisibleScaleXMax: (id: string) => number | null;
  getValuesCount: (id: string) => number | null;
  arePointsVisible: (id: string) => string | null;
  getDataPoint: (id: string, seriesIndex: number, index: number) => { x: number; y: number } | null;
  getDataPointPixelCoordinates: (id: string, seriesIndex: number, index: number) => { x: number; y: number } | null;
  getSeriesColor: (id: string, seriesIndex: number) => string | null;
  getVisibleSeriesCount: (id: string) => number | null;
  getHiddenSeriesCount: (id: string) => number | null;
  linkCharts: (id1: string, id2: string) => void;
  getBinCount: (id: string) => number | null;
  areHistogramBinsShowing: (id: string) => string | null;
  areHistogramLinesShowing: (id: string) => string | null;
  areHistogramLinesAndPointsShowing: (id: string) => string | null;
  areTooltipsEnabled: (id: string) => string | null;
  isLinearScale: (id: string) => string | null;
};

declare global {
  interface Window {
    getAppChartManager: () => AppChartManager | null;
    setAppChartManager: (chartManager: AppChartManager) => void;
  }
}

(() => {
  let appChartManager: AppChartManager | null = null;
  window.getAppChartManager = () => appChartManager;
  window.setAppChartManager = (chartManager) => (appChartManager = chartManager);
})();

const getChartManager = (): AppChartManager => {
  const found = window.getAppChartManager();
  if (found !== null) {
    return found;
  }

  const charts: Record<string, ChartReference> = {};

  const chartManager: AppChartManager = {
    addChart: (chart) => {
      charts[chart.id] = chart;
    },
    removeChart: (id) => {
      delete charts[id];
    },
    getChart: (id) => charts[id] || null,
    getXAxis: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.xAxes.get(0);
    },
    getSeries: (id, seriesIndex) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.renderableSeries.get(seriesIndex) || null;
    },
    getXAxisZoomLevel: (id) => {
      const xAxis = chartManager.getXAxis(id);
      if (!xAxis) return 0;
      const zoomExtentsRange = xAxis.zoomExtentsRange;
      const visibleRange = xAxis.visibleRange;
      const zoomDIff = zoomExtentsRange.max - zoomExtentsRange.min;
      const visibleDiff = visibleRange.max - visibleRange.min;
      return visibleDiff / zoomDIff;
    },
    areHistogramBinsShowing: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      const found = chart.surface.renderableSeries
        .asArray()
        .find((current) => current.type === "ColumnSeries" && current.isVisible);
      return found !== undefined ? "true" : "false";
    },
    areHistogramLinesShowing: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      const found = chart.surface.renderableSeries
        .asArray()
        .filter((current) => current.type === "LineSeries" && current.isVisible);

      return found.length === 2 ? "true" : "false";
    },
    areHistogramLinesAndPointsShowing: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      const found = chart.surface.renderableSeries
        .asArray()
        .filter((current) => current.type === "LineSeries" && current.isVisible);

      return found.length === 3 ? "true" : "false";
    },
    isLinearScale: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      const yAxis = chart.surface.yAxes.get(0);
      if (!yAxis) return null;
      return yAxis.tickProvider instanceof CustomYTickProvider ? "false" : "true";
    },
    areTooltipsEnabled: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.chartModifiers
        .asArray()
        .find((current) => current instanceof RolloverModifier && current.isEnabled)
        ? "true"
        : "false";
    },
    getNumberOfSeries: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.renderableSeries.size();
    },
    getFullScaleXMin: (id) => {
      const xAxis = chartManager.getXAxis(id);
      if (!xAxis) return null;
      return xAxis.zoomExtentsRange.min;
    },
    getFullScaleXMax: (id) => {
      const xAxis = chartManager.getXAxis(id);
      if (!xAxis) return null;
      return xAxis.zoomExtentsRange.max;
    },
    getVisibleScaleXMin: (id) => {
      const xAxis = chartManager.getXAxis(id);
      if (!xAxis) return null;
      return xAxis.visibleRange.min;
    },
    getVisibleScaleXMax: (id) => {
      const xAxis = chartManager.getXAxis(id);
      if (!xAxis) return null;
      return xAxis.visibleRange.max;
    },
    getValuesCount: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.renderableSeries.get(0).dataSeries.count();
    },
    arePointsVisible: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.renderableSeries.get(0)?.pointMarker !== undefined ? "true" : "false";
    },
    getDataPoint: (id, seriesIndex, index) => {
      const series = chartManager.getSeries(id, seriesIndex);
      if (!series) return null;
      const dataSeries = series.dataSeries;
      return { x: dataSeries.getNativeXValues().get(index), y: dataSeries.getNativeYValues().get(index) };
    },
    getDataPointPixelCoordinates: (id, seriesIndex, index) => {
      const series = chartManager.getSeries(id, seriesIndex);
      if (!series) return null;
      const xCalc = series.getCurrentRenderPassData().getxCoordinateCalculator();
      const yCalc = series.getCurrentRenderPassData().getyCoordinateCalculator();
      const dataSeries = series.dataSeries;
      return {
        x: xCalc.getCoordinate(dataSeries.getNativeXValues().get(index)),
        y: yCalc.getCoordinate(dataSeries.getNativeYValues().get(index))
      };
    },
    getBinCount: (id) => {
      const series = chartManager.getSeries(id, 0);
      if (!series) return null;
      return series.dataSeries.getNativeXValues().size();
    },
    getSeriesColor: (id, seriesIndex) => {
      const series = chartManager.getSeries(id, seriesIndex);
      if (!series) return null;
      return series?.stroke;
    },
    getVisibleSeriesCount: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.renderableSeries.asArray().filter((series) => series.isVisible).length;
    },
    getHiddenSeriesCount: (id) => {
      const chart = charts[id];
      if (!chart || !chart.surface) return null;
      return chart.surface.renderableSeries.asArray().filter((series) => !series.isVisible).length;
    },
    linkCharts: (id1, id2) => {
      const sciChart0 = charts[id1]?.surface;
      const sciChart1 = charts[id2]?.surface;
      if (!sciChart0 || !sciChart1) return;

      sciChart0.chartModifiers.asArray().forEach((cm) => (cm.modifierGroup = "ModifierGroupId"));
      sciChart1.chartModifiers.asArray().forEach((cm) => (cm.modifierGroup = "ModifierGroupId"));

      const xAxis0 = sciChart0.xAxes.get(0);
      const xAxis1 = sciChart1.xAxes.get(0);
      xAxis0.visibleRangeChanged.subscribe((data1) => {
        if (!data1) return;
        xAxis1.visibleRange = data1.visibleRange;
      });
      xAxis1.visibleRangeChanged.subscribe((data1) => {
        if (!data1) return;
        xAxis0.visibleRange = data1.visibleRange;
      });

      const verticalGroup = new SciChartVerticalGroup();
      verticalGroup.addSurfaceToGroup(sciChart0);
      verticalGroup.addSurfaceToGroup(sciChart1);
    }
  };
  window.setAppChartManager(chartManager);
  return chartManager;
};

export const useChartManager = () => {
  const getChart = useMemo(() => {
    const { getChart } = getChartManager();
    return getChart;
  }, []);
  const addChart = useMemo(() => {
    const { addChart } = getChartManager();
    return addChart;
  }, []);
  const removeChart = useMemo(() => {
    const { removeChart } = getChartManager();
    return removeChart;
  }, []);

  return { getChart, addChart, removeChart };
};
