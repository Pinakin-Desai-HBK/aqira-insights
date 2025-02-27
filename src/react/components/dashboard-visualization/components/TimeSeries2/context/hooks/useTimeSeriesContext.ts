import { Context, RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VisualizationDetailsContext } from "src/react/components/dashboard-visualization/context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { TimeSeriesKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import { VisualizationDataContext } from "src/react/components/dashboard-visualization/context/VisualizationDataContext";
import { VisualizationDataContextData } from "src/react/redux/types/ui/dashboardVisualization";
import { SignalRDataSetUpdatedEvent } from "src/react/redux/types/system/signalR";
import { useWorkspaceItemDimensions } from "src/react/redux/hooks/useWorkspaceItemDimensions";
import { useDebouncedCallback } from "use-debounce";
import { VIS_ERROR_TYPES } from "src/react/components/dashboard-visualization/components/Shared/types";
import { ChartData, StoredChartState, TimeSeriesContextData } from "../../types";
import { initialiseChartData } from "./initialiseChartData";
import { getConfigHelpers } from "./utils/storedChartState";
import { useRefreshActions } from "./useRefreshActions";
import { emptyChartData } from "./utils/emptyChartData";
import { prepareChart } from "../../chart/prepare/prepareChart";
import { createSciChartSurfaceForElem } from "../../../useSciChartSurface";
import { fetchColumnData, updateColumnData } from "./timeSeriesDatasets";
import { handleNewChartData } from "../../chart/handleNewChartData";

const clearChart = (chartDataRef: RefObject<ChartData>) => {
  chartDataRef.current.dataSetId = null;
  chartDataRef.current.chartColumns = [];
  chartDataRef.current.minimapChartColumns = [];
};

export const useTimeSeriesContext = (): TimeSeriesContextData => {
  const { name, properties } = useContext(VisualizationDetailsContext) as VisualizationDetails<TimeSeriesKey>;
  const {
    dashboardId,
    visualizationId,
    setOnDataSetUpdatedCallback,
    datasets,
    getSchema,
    hasError: hasVisualizationDataError,
    errorCode: visualizationDataErrorCode
  } = useContext(VisualizationDataContext as Context<VisualizationDataContextData<TimeSeriesKey>>);
  const dimensions = useWorkspaceItemDimensions(visualizationId);
  const legendRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const minimapRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const refreshActionsRef: RefObject<(() => void) | null> = useRef<(() => void) | null>(null);
  const chartDataRef = useRef(emptyChartData());
  const [visError, setVisError] = useState<VIS_ERROR_TYPES | null>(null);
  const [visMessage, setVisMessage] = useState<string | null>(null);
  const [chartData, setChartData] = useState(chartDataRef.current);

  const getStoredChartState = useCallback(
    () => getConfigHelpers({ dashboardId, visualizationId }).getChartState(),
    [dashboardId, visualizationId]
  );

  const setStoredChartState = useCallback(
    (params: { newStoredChartState: Partial<StoredChartState> }) => {
      getConfigHelpers({ dashboardId, visualizationId }).setStoredChartState(params.newStoredChartState);
    },
    [dashboardId, visualizationId]
  );

  const resetZoom = useCallback(async () => {
    if (chartDataRef.current.chartSurface && chartDataRef.current.fullRange) {
      chartDataRef.current.chartSurface.zoomExtents();
      setStoredChartState({ newStoredChartState: { range: null } });
    }
  }, [setStoredChartState]);

  const refreshActionsHandler = useRefreshActions({
    resetZoom,
    setStoredChartState
  });

  const setVisErrorHandler = useCallback((error: VIS_ERROR_TYPES | null) => {
    setVisError(() => {
      if (error) {
        clearChart(chartDataRef);
        setVisMessage(() => {
          return null;
        });
      }
      return error;
    });
  }, []);

  const processChartDataHandler = useCallback(async () => {
    if (!ref.current || !minimapRef.current || !legendRef.current || !dimensions) return;

    const sciChartResult = await createSciChartSurfaceForElem(ref.current);
    if (!sciChartResult) return;

    const storedChartState = getStoredChartState();
    await prepareChart({
      chartData: chartDataRef,
      refs: { ref, minimapRef, legendRef },
      sciChartResult,
      checkedRefreshActions: refreshActionsRef.current ? refreshActionsRef.current : () => null,
      updateColumnData: (params) =>
        updateColumnData({ ...params, dashboardId, visualizationId, dimensions, properties }),
      setStoredChartState,
      storedChartState,
      name
    });

    setTimeout(() => {
      if (!chartDataRef.current.overview || !chartDataRef.current.chartSurface)
        throw new Error("Chart elements not initialised");
      chartDataRef.current.overview.rangeSelectionModifier.selectedArea =
        chartDataRef.current.chartSurface.xAxes.get(0).visibleRange;
      const showMinimap = storedChartState?.showMinimap ?? true;
      chartDataRef.current.overview.overviewSciChartSurface.domChartRoot.style.display = showMinimap ? "block" : "none";

      setTimeout(() => {
        setChartData(chartDataRef.current);
        setVisMessage(() => {
          return null;
        });
      }, 0);
    }, 100);
  }, [dimensions, getStoredChartState, setStoredChartState, name, dashboardId, visualizationId, properties]);

  const initialiseChartDataHandler = useCallback(
    async (dataSetId: string, updating: boolean) => {
      const chartDataWithoutRefs = await initialiseChartData({
        dataSetId,
        dashboardId,
        visualizationId,
        getSchema,
        dimensions,
        name,
        properties
      });

      if (typeof chartDataWithoutRefs === "string") {
        if (chartDataWithoutRefs === "DATA_LOADING")
          setVisMessage(() => {
            return "Data is loading...";
          });
        else setVisErrorHandler(chartDataWithoutRefs);
        return;
      }
      if (chartDataWithoutRefs === null) {
        setVisErrorHandler("NO_DATA_AVAILABLE");
        return;
      }

      chartDataRef.current = { ...chartDataRef.current, ...chartDataWithoutRefs };
      setChartData(chartDataRef.current);
      if (!updating) {
        setVisMessage(() => {
          return "Preparing data...";
        });
      }
      setTimeout(() => {
        if (refreshActionsRef.current) refreshActionsRef.current();
        processChartDataHandler();
      }, 0);
    },
    [dashboardId, visualizationId, getSchema, dimensions, setVisErrorHandler, processChartDataHandler, name, properties]
  );

  const setDataSetId = useCallback(
    async (dataSetId: string | null) => {
      if (chartDataRef.current.dataSetId === dataSetId) {
        return;
      }
      if (!dataSetId) {
        chartDataRef.current.dataSetId = null;
        return;
      }
      chartDataRef.current.dataSetId = dataSetId;
      initialiseChartDataHandler(dataSetId, false);
    },
    [initialiseChartDataHandler]
  );

  const setDataSetIdHandler = useDebouncedCallback(
    async ({ dataSetId }: { dataSetId: string | null }) => {
      if (chartDataRef.current.dataSetId === dataSetId) {
        return;
      }
      if (!dataSetId) {
        chartDataRef.current.dataSetId = null;
        return;
      }
      setVisMessage(() => {
        setVisErrorHandler(null);
        setTimeout(async () => {
          await setDataSetId(dataSetId);
        }, 0);
        return "Loading data...";
      });
    },
    500,
    {
      maxWait: 250,
      trailing: true,
      leading: false
    }
  );

  useEffect(() => {
    refreshActionsRef.current = () => {
      refreshActionsHandler(chartDataRef.current);
    };
    refreshActionsRef.current();
  }, [refreshActionsHandler]);

  const debouncedUpdatedHandler = useDebouncedCallback(
    async ({ dataSetId }: { dataSetId: string }) => {
      if (dataSetId !== chartDataRef.current.dataSetId || !dimensions) {
        return;
      }

      const range = getConfigHelpers({ dashboardId, visualizationId }).getRange();
      const isStoredRangeInFullRange =
        range && range.min >= chartDataRef.current.fullRange.min && range.max <= chartDataRef.current.fullRange.max;

      const visibleRange = isStoredRangeInFullRange ? range : null;
      const schema = await getSchema({ dataSetId });
      const { state } = schema;
      if (state === "Loading") {
        return;
      }

      const result = await fetchColumnData({
        dataSetId,
        visibleRange,
        dashboardId,
        visualizationId,
        dimensions,
        properties,
        schema: await getSchema({ dataSetId }),
        name
      });
      if (!result) {
        return;
      }

      if (result.state !== "Loaded") {
        return;
      }
      const {
        data: {
          chartProps: { xLimits },
          chartColumnsWithUpdatedLabels,
          minimapColumns,
          datasetLabelsData
        }
      } = result;

      chartDataRef.current.chartColumns = chartColumnsWithUpdatedLabels;
      chartDataRef.current.minimapChartColumns = minimapColumns;
      chartDataRef.current.fullRange = xLimits;
      chartDataRef.current.range = visibleRange || xLimits;
      chartDataRef.current.datasetLabels = datasetLabelsData;
      setTimeout(() => {
        if (refreshActionsRef.current) refreshActionsRef.current();
      }, 0);

      handleNewChartData(chartDataRef.current, getConfigHelpers({ dashboardId, visualizationId }).getChartState());
    },
    500,
    {
      maxWait: 250,
      trailing: true,
      leading: false
    }
  );

  useEffect(() => {
    setOnDataSetUpdatedCallback(async ({ message: { dataSetId } }: { message: SignalRDataSetUpdatedEvent }) => {
      const currentDataSetId = chartDataRef.current.dataSetId;
      if (dataSetId !== currentDataSetId || !currentDataSetId) {
        return;
      }
      debouncedUpdatedHandler({ dataSetId: currentDataSetId });
    });
    setDataSetIdHandler({ dataSetId: datasets !== null && datasets[0] ? datasets[0] : null });
  }, [datasets, debouncedUpdatedHandler, setDataSetIdHandler, setOnDataSetUpdatedCallback]);

  useEffect(() => {
    if (hasVisualizationDataError) {
      setVisErrorHandler(visualizationDataErrorCode);
      chartDataRef.current.dataSetId = null;
    }
  }, [setVisErrorHandler, hasVisualizationDataError, visualizationDataErrorCode]);

  useEffect(() => {
    const chartData = chartDataRef.current;
    return () => {
      if (chartData.chartSurface) {
        chartData.chartSurface.delete();
      }
      chartDataRef.current.chartSurface = null;
    };
  }, []);

  const refreshChart = useCallback(() => {
    if (chartDataRef.current.dataSetId && chartDataRef.current.chartColumns.length > 0) {
      const dataSetId = chartDataRef.current.dataSetId;
      chartDataRef.current.dataSetId = null;
      setDataSetIdHandler({ dataSetId });
    }
  }, [setDataSetIdHandler]);

  useEffect(() => {
    if (properties.numtraces !== chartDataRef.current.numtraces) {
      chartDataRef.current.numtraces = properties.numtraces;
      refreshChart();
    }
  }, [properties.numtraces, refreshChart]);

  return {
    visError,
    visMessage,
    chartData,
    refreshActionsRef,
    ref,
    minimapRef,
    legendRef
  };
};
