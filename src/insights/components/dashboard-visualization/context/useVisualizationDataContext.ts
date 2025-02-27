import { useCallback, useContext, useEffect, useState } from "react";
import {
  OnDataSetUpdatedCallback,
  VisualizationDataContextData,
  VisualizationDataContextState,
  DataVisTypes
} from "src/insights/redux/types/ui/dashboardVisualization";
import { getRange } from "../../../api/Data";
import usePubSubManager from "../../../pubsub-manager/usePubSubManager";
import { SubscriberTypes } from "../../../redux/types/system/pub-sub";
import { DataSetId } from "src/insights/redux/types/ui/dashboardVisualization";
import { useDebouncedCallback } from "use-debounce";
import { SignalRDataSetUpdatedEvent } from "src/insights/redux/types/system/signalR";
import { popoutDetails } from "src/insights/popoutDetails";
import { getInitialState } from "./utils/getInitialState";
import { getDataSetAndSchema } from "./utils/getDataSetAndSchema";
import { VisualizationDetailsContext } from "./VisualizationDetailsContext";
import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";

export const useVisualizationDataContext = (): VisualizationDataContextData<DataVisTypes> => {
  const {
    type,
    id: visualizationId,
    workspace: { id: dashboardId },
    properties
  } = useContext(VisualizationDetailsContext) as VisualizationDetails<DataVisTypes>;

  if (!properties) {
    throw new Error(`No properties: ${type}`);
  }
  const { isPopout, popoutId } = popoutDetails;
  const pubSub = usePubSubManager();

  const [{ datasets, onDataSetUpdatedCallback, schemaStore, hasError, errorCode }, setState] = useState<
    VisualizationDataContextState<typeof type>
  >(() => getInitialState<typeof type>({ visualizationId, dashboardId, properties }));

  useEffect(() => {
    setState(getInitialState<typeof type>({ visualizationId, dashboardId, properties }));
  }, [dashboardId, properties, visualizationId]);

  const fetchDataSetAndSchema = useCallback(async () => {
    const result = await getDataSetAndSchema({ dashboardId, visualizationId, type: properties.type });
    if (result && "type" in result && result.type === "api_error") {
      const { errorsArray } = result;
      const newState: VisualizationDataContextState<typeof type> = {
        ...getInitialState<typeof type>({ visualizationId, dashboardId, properties }),
        hasError: true,
        errorCode: errorsArray && errorsArray.length > 0 ? "API_ERROR" : null
      };
      setState(newState);
      return newState;
    } else if (result === null) {
      const newState: VisualizationDataContextState<typeof type> = {
        ...getInitialState<typeof type>({ visualizationId, dashboardId, properties }),
        hasError: true,
        errorCode: "NO_DATA_FOR_DATA_SET"
      };
      setState(newState);
      return newState;
    } else {
      const newState: Partial<VisualizationDataContextState<typeof type>> = {
        ...result,
        hasError: false,
        errorCode: null
      };

      setState((prev) => ({ ...prev, ...newState }));
      return newState;
    }
  }, [dashboardId, properties, visualizationId]);

  useEffect(() => {
    if (datasets !== null || hasError) return;
    (async () => {
      const newState = await fetchDataSetAndSchema();
      setState((prev) => ({ ...prev, ...newState }));
    })();
  }, [datasets, fetchDataSetAndSchema, hasError]);

  const debouncedOnDataSetUpdatedCallback = useDebouncedCallback(
    async (params: { message: SignalRDataSetUpdatedEvent }) => {
      if (onDataSetUpdatedCallback) {
        const schema = schemaStore ? schemaStore[params.message.dataSetId] : null;

        if (!schema || schema.state === "Loading") {
          const newState = await fetchDataSetAndSchema();
          setState((prev) => {
            setTimeout(() => onDataSetUpdatedCallback(params), 0);
            return { ...prev, ...newState };
          });
        } else {
          onDataSetUpdatedCallback(params);
        }
      }
    },
    25,
    { leading: true, trailing: true, maxWait: 25 }
  );

  useEffect(() => {
    const unsubscribeCallbacks = datasets?.map((dataSetId) =>
      pubSub.subscribe(
        `S2CG-DataSetUpdatedEvent-${dataSetId}`,
        ({ message }) => {
          debouncedOnDataSetUpdatedCallback({ message });
        },
        isPopout ? SubscriberTypes.MAIN : SubscriberTypes.POPUP,
        popoutId
      )
    );
    return () => unsubscribeCallbacks?.forEach((unsubscribe) => unsubscribe());
  }, [popoutId, pubSub, debouncedOnDataSetUpdatedCallback, datasets, isPopout]);

  useEffect(() => {
    const unsubscribe = pubSub.subscribe(
      `S2C-DataSetAvailableEvent`,
      async () => {
        setTimeout(async () => {
          const newState = await fetchDataSetAndSchema();
          setState((prev) => ({ ...prev, ...newState }));
        }, 100);
      },
      isPopout ? SubscriberTypes.MAIN : SubscriberTypes.POPUP,
      popoutId
    );
    return () => unsubscribe();
  }, [datasets, fetchDataSetAndSchema, isPopout, popoutId, pubSub]);

  // Get the schema for a dataset from the schema store if available
  const getSchema = useCallback(
    async ({ dataSetId }: DataSetId) => {
      const schema = schemaStore ? schemaStore[dataSetId] : null;
      if (!schema) {
        throw new Error(`Schema is not available`);
      }
      return schema;
    },
    [schemaStore]
  );

  const setOnDataSetUpdatedCallback = useCallback((onDataSetUpdatedCallback: OnDataSetUpdatedCallback | null) => {
    setState((prev) => ({ ...prev, onDataSetUpdatedCallback }));
  }, []);

  const connectionIsEmpty = properties.connection === null || properties.connection === "";

  return {
    getSchema,
    setOnDataSetUpdatedCallback,
    getDataRange: getRange,
    datasets,
    dashboardId,
    visualizationId,
    hasError,
    errorCode,
    connectionIsEmpty
  };
};
