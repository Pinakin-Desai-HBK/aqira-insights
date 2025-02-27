import { Context, RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChartData, HistogramContextData } from "../../../types";
import { VisualizationDetailsContext } from "src/react/components/dashboard-visualization/context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { Histogram3DKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import { VisualizationDataContext } from "src/react/components/dashboard-visualization/context/VisualizationDataContext";
import { VisualizationDataContextData } from "src/react/redux/types/ui/dashboardVisualization";
import { SignalRDataSetUpdatedEvent } from "src/react/redux/types/system/signalR";
import { processChartData } from "./processChartData";
import { updateSelectedChannel } from "./support/prepareChartData";
import { DialogContext } from "src/react/components/dialog/context/DialogContext";
import { NodeToolbarContext } from "src/react/components/dashboard-visualization/toolbar/context/ToolbarContext";
import { ToolbarContextData } from "src/react/redux/types/ui/toolbar";
import { emptyChartData } from "./support/emptyChartData";
import { getConfigHelpers, setStoredChartState } from "./support/storedChartState";
import { refreshActions } from "./support/refreshActions";
import { useWorkspaceItemDimensions } from "src/react/redux/hooks/useWorkspaceItemDimensions";
import { useDebouncedCallback } from "use-debounce";
import { initialiseChartData, initialiseIndexes } from "./initialiseChartData";
import { IndexSelectionDetails } from "src/react/components/dashboard-visualization/components/Shared/chart/types";
import { getIndexSelectDetails } from "src/react/components/dashboard-visualization/components/Shared/chart/getIndexSelectDetails";
import { VIS_ERROR_TYPES } from "src/react/components/dashboard-visualization/components/Shared/types";

const clearChart = (chartDataRef: RefObject<ChartData>) => {
  chartDataRef.current.dataSetId = null;
  chartDataRef.current.data = null;
  chartDataRef.current.selectedChannel = null;
};

export const useHistogramContext = (): HistogramContextData => {
  const { name } = useContext(VisualizationDetailsContext) as VisualizationDetails<Histogram3DKey>;
  const {
    dashboardId,
    visualizationId,
    setOnDataSetUpdatedCallback,
    datasets,
    getSchema,
    hasError: hasVisualizationDataError,
    errorCode: visualizationDataErrorCode
  } = useContext(VisualizationDataContext as Context<VisualizationDataContextData<Histogram3DKey>>);
  const { closeDialog, openDialog } = useContext(DialogContext);
  const { handlerSetters, key } = useContext(
    NodeToolbarContext
  ) as ToolbarContextData<"DashboardCanvas-ViewModeNode-Histogram3D">;
  const dimensions = useWorkspaceItemDimensions(visualizationId);

  const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const refreshActionsRef: RefObject<(() => void) | null> = useRef<(() => void) | null>(null);
  const chartDataRef = useRef(emptyChartData());
  const [visError, setVisError] = useState<VIS_ERROR_TYPES | null>(null);
  const [visMessage, setVisMessage] = useState<string | null>(null);
  const [chartData, setChartData] = useState(chartDataRef.current);

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
    const chartData = await processChartData({
      chartData: chartDataRef.current,
      dashboardId,
      name,
      visualizationId,
      chartElement: ref.current
    });
    if (typeof chartData === "string") {
      clearChart(chartDataRef);
      return;
    }
    if (chartData === null) return;

    chartDataRef.current = chartData;

    setTimeout(() => {
      setChartData(chartData);
      setVisMessage(() => {
        return null;
      });
    }, 0);
  }, [dashboardId, name, visualizationId]);

  const initialiseChartDataHandler = useCallback(
    async (dataSetId: string) => {
      const chartDataWithoutRefs = await initialiseChartData({
        dataSetId,
        dashboardId,
        visualizationId,
        getSchema,
        dimensions
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

      setTimeout(() => {
        if (refreshActionsRef.current) refreshActionsRef.current();
      }, 0);

      setTimeout(() => {
        processChartDataHandler();
      }, 0);
      setVisMessage(() => {
        return "Preparing data...";
      });
    },
    [dashboardId, visualizationId, getSchema, dimensions, setVisErrorHandler, processChartDataHandler]
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

      initialiseChartDataHandler(dataSetId);
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

  const setSelectedIndex = useCallback(
    (selectedIndex: number) => {
      const chartData = chartDataRef.current;
      const storedSelectedIndex = getConfigHelpers({
        dashboardId,
        visualizationId
      }).getSelectedIndex();
      const dataSetId = chartData.dataSetId;
      if (selectedIndex === storedSelectedIndex || dataSetId === null) return;

      setStoredChartState({ newStoredChartState: { selectedIndex }, dashboardId, visualizationId });

      setTimeout(() => {
        initialiseChartDataHandler(dataSetId);
      }, 0);
      setVisMessage(() => {
        return "Loading data...";
      });
    },
    [dashboardId, initialiseChartDataHandler, visualizationId]
  );

  const setSelectedChannel = useCallback(
    (newSelectedChannel: string) => {
      const updatedChartData = updateSelectedChannel(chartDataRef.current, newSelectedChannel);
      if (!updatedChartData) return;
      const selectedChannel = updatedChartData.selectedChannel;
      if (!selectedChannel) return;

      setStoredChartState({
        newStoredChartState: { selectedChannel },
        dashboardId,
        visualizationId
      });
      chartDataRef.current = { ...chartDataRef.current, ...updatedChartData };
      processChartDataHandler();
    },
    [dashboardId, visualizationId, processChartDataHandler]
  );

  useEffect(() => {
    refreshActionsRef.current = () => {
      refreshActions({
        closeDialog,
        dashboardId,
        handlerSetters,
        key,
        openDialog,
        visualizationId
      });
    };
    refreshActionsRef.current();
  }, [closeDialog, dashboardId, handlerSetters, key, openDialog, visualizationId]);

  const updatedHandler = useCallback(async () => {
    if (!chartDataRef.current.dataSetId) return;

    const result = await initialiseIndexes({
      dashboardId,
      dataSetId: chartDataRef.current.dataSetId,
      visualizationId,
      selectLastIndex: true
    });
    if (typeof result === "string") {
      return;
    }
    const { checkedSelectedIndex, fetchedIndexes } = result;
    const hasIndexChanged = checkedSelectedIndex !== chartDataRef.current.selectedIndex;
    const indexSelectionDetails: IndexSelectionDetails = getIndexSelectDetails({ dimensions, indexes: fetchedIndexes });
    const newChartData: ChartData = {
      ...chartDataRef.current,
      selectedIndex: checkedSelectedIndex,
      indexes: fetchedIndexes,
      indexSelectionDetails
    };

    if (hasIndexChanged) {
      setStoredChartState({
        newStoredChartState: { selectedIndex: checkedSelectedIndex },
        dashboardId,
        visualizationId
      });
      initialiseChartDataHandler(chartDataRef.current.dataSetId);
      return;
    }
    if (!chartData.refs) return;
    const processedChartData = await processChartData({
      chartData: newChartData,
      dashboardId,
      name,
      visualizationId,
      chartElement: ref.current
    });
    if (typeof processedChartData === "string" || processedChartData === null) return;
    chartDataRef.current = processedChartData;

    setTimeout(() => {
      setChartData(processedChartData);
      setVisMessage(() => {
        return null;
      });
    }, 0);
  }, [chartData.refs, dashboardId, dimensions, initialiseChartDataHandler, name, visualizationId]);

  const debouncedUpdatedHandler = useDebouncedCallback(
    async ({ dataSetId }: { dataSetId: string }) => {
      if (dataSetId !== chartDataRef.current.dataSetId) return;

      if (chartDataRef.current.data === null) {
        initialiseChartDataHandler(dataSetId);
        return;
      }
      await updatedHandler();
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
      if (dataSetId !== currentDataSetId || !currentDataSetId) return;
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

  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      ref.current = element;
      if (!hasVisualizationDataError && chartDataRef.current.dataSetId !== null) processChartDataHandler();
    },
    [hasVisualizationDataError, processChartDataHandler]
  );

  useEffect(() => {
    if (refreshActionsRef.current) refreshActionsRef.current();
  }, [chartData.refs]);

  useEffect(() => {
    const refs = chartDataRef.current.refs;
    return () => {
      if (refs?.chartSurface) {
        refs?.chartSurface.delete();
      }
      chartDataRef.current.refs = null;
    };
  }, []);

  return {
    visError,
    visMessage,
    chartData,
    refreshActionsRef,
    setRef,
    setSelectedChannel,
    setSelectedIndex
  };
};
