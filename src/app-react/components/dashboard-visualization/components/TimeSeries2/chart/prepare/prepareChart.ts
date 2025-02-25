import { RefObject } from "react";
import { ChartData, ElementRefs, RefreshColmnsHandler, StoredChartState } from "../../types";
import {
  EAxisAlignment,
  FastLineRenderableSeries,
  NumberRange,
  NumericAxis,
  SciChartJsNavyTheme,
  SciChartOverview,
  TWebAssemblyChart
} from "scichart";
import { axisOptions } from "../../../Shared/chart/prepare/utils/axisOptions";
import { formatLabel } from "../../../Shared/chart/prepare/utils/formatLabel";
import { configureModifiers } from "./support/configureModifiers";
import { addSeries } from "./support/addSeries";
import { handleVisibleRangeChange } from "./support/handleVisibleRangeChange";
import { styleOverviewRangeSelection } from "../../../Shared/chart/prepare/utils/styleOverviewRangeSelection";
import { updateStoredHiddenColumns } from "../../utils/updateStoredHiddenColumns";
import { getYRangeFromData } from "../utils/getYRangeFromData";
import { syncOverviewWidth } from "../../../Shared/chart/prepare/utils/syncOverviewWidth";
import { createCursorListener } from "../../../Shared/chart/prepare/utils/createCursorListener";

export const prepareChart = async ({
  chartData,
  checkedRefreshActions,
  refs,
  storedChartState,
  name,
  sciChartResult,
  setStoredChartState,
  updateColumnData
}: {
  chartData: RefObject<ChartData>;
  refs: ElementRefs;
  sciChartResult: TWebAssemblyChart;
  checkedRefreshActions: () => void;
  updateColumnData: RefreshColmnsHandler;
  setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void;
  storedChartState: StoredChartState | null;
  name: string;
}) => {
  const { ref, legendRef, minimapRef } = refs;

  if (
    !ref.current ||
    !minimapRef.current ||
    !legendRef.current ||
    !chartData.current ||
    !chartData.current.fullRange ||
    !chartData.current.dataSetId
  )
    return;

  const { fullRange, range, chartColumns, dataSetId, minimapChartColumns } = chartData.current;
  chartData.current.chartSurface = sciChartResult.sciChartSurface;
  chartData.current.wasmContext = sciChartResult.wasmContext;

  chartData.current.chartSurface.rendered.subscribe(() => {
    if (!chartData.current.chartSurface || !minimapRef.current) return;
    syncOverviewWidth(chartData.current.chartSurface, minimapRef.current);
  });

  const yRange = getYRangeFromData(minimapChartColumns);
  if (!yRange) return;

  const visibleRange = range ? new NumberRange(range.min, range.max) : new NumberRange(fullRange.min, fullRange.max);
  const xAxis = new NumericAxis(chartData.current.wasmContext, {
    ...axisOptions,
    axisTitle: chartData.current.xAxisLabel,
    rotation: 270,
    maxAutoTicks: 20,
    autoTicks: true,
    growBy: new NumberRange(0.1, 0.1),
    visibleRange,
    visibleRangeLimit: new NumberRange(fullRange.min, fullRange.max),
    zoomExtentsRange: new NumberRange(fullRange.min, fullRange.max),
    zoomExtentsToInitialRange: false
  });
  xAxis.labelProvider.formatLabel = (dataLabel: number) => {
    if (!refs.minimapRef.current) throw Error("No minimap ref found");
    return formatLabel(dataLabel, xAxis.visibleRange, refs.minimapRef.current.clientWidth);
  };
  xAxis.labelProvider.formatCursorLabel = (value: number) => {
    if (!refs.minimapRef.current) throw Error("No minimap ref found");
    return formatLabel(value, xAxis.visibleRange, refs.minimapRef.current.clientWidth);
  };
  chartData.current.chartSurface.xAxes.add(xAxis);
  const yAxis = new NumericAxis(chartData.current.wasmContext, {
    ...axisOptions,
    maxAutoTicks: 20,
    autoTicks: true,
    axisTitle: chartData.current.yAxisLabel,
    axisAlignment: EAxisAlignment.Left,
    growBy: new NumberRange(0.1, 0.1),
    zoomExtentsToInitialRange: false
  });
  yAxis.labelProvider.formatLabel = (dataLabel: number) => formatLabel(dataLabel, yAxis.visibleRange, 20);
  chartData.current.chartSurface.yAxes.add(yAxis);

  chartData.current.chartSurface.padding = { left: 0, top: 0, right: 0, bottom: 0 };
  chartData.current.chartSurface.background = "#FFF";
  configureModifiers(chartData, chartData.current.chartSurface, legendRef.current, ({ newStoredChartState }) => {
    setStoredChartState({ newStoredChartState });
  });

  chartData.current.xySeriesArray = addSeries(
    chartData.current.wasmContext,
    chartData.current.chartSurface,
    chartColumns,
    storedChartState,
    true
  );

  chartData.current.overview = await SciChartOverview.create(chartData.current.chartSurface, minimapRef.current, {
    theme: new SciChartJsNavyTheme(),
    canvasBorder: { border: 0 },
    transformRenderableSeries: (series) => {
      if (!chartData.current.wasmContext) throw new Error("Wasm context not found");
      return new FastLineRenderableSeries(chartData.current.wasmContext, { dataSeries: series.dataSeries });
    },
    overviewYAxisOptions: {
      growBy: new NumberRange(0.1, 0.1),
      visibleRange: yRange,
      visibleRangeLimit: yRange,
      zoomExtentsRange: yRange,
      zoomExtentsToInitialRange: false
    },
    overviewXAxisOptions: {
      growBy: new NumberRange(0, 0),
      visibleRange,
      zoomExtentsRange: new NumberRange(fullRange.min, fullRange.max),
      visibleRangeLimit: new NumberRange(fullRange.min, fullRange.max),
      zoomExtentsToInitialRange: false
    },
    padding: { bottom: 0, left: 0, right: 0, top: 0 }
  });
  chartData.current.overview.overviewSciChartSurface.background = "#FFF";

  createCursorListener(chartData.current.overview);

  chartData.current.overview.rangeSelectionModifier.onSelectedAreaChanged = (range: NumberRange | undefined) => {
    if (!range) return;
    if (chartData.current.chartSurface) chartData.current.chartSurface.xAxes.get(0).visibleRange = range;
    setStoredChartState({ newStoredChartState: { range } });
  };

  chartData.current.chartSurface.renderableSeries.asArray().forEach((series) => {
    series.isVisibleChanged.subscribe(() => {
      if (!chartData.current.overview || !chartData.current.chartSurface) throw new Error("Chart not found");
      const seriesName = series.dataSeries.dataSeriesName;

      chartData.current.overview.overviewSciChartSurface.renderableSeries.asArray().forEach((overviewSeries) => {
        if (overviewSeries.dataSeries.dataSeriesName === seriesName) {
          overviewSeries.isVisible = series.isVisible;
        }
      });
      updateStoredHiddenColumns({
        chart: chartData.current.chartSurface,
        dataSetId,
        setStoredChartState
      });
      checkedRefreshActions();
    });
  });

  styleOverviewRangeSelection(chartData.current.overview, name);
  chartData.current.minimapXySeriesArray = addSeries(
    chartData.current.wasmContext,
    chartData.current.overview.overviewSciChartSurface,
    minimapChartColumns,
    storedChartState,
    false
  );

  handleVisibleRangeChange({
    chartData: chartData.current,
    updateColumnData,
    xAxis
  });

  chartData.current.chartSurface.xAxes.get(0).visibleRangeChanged.subscribe((args) => {
    if (!args) return;
    checkedRefreshActions();
  });

  checkedRefreshActions();
};
