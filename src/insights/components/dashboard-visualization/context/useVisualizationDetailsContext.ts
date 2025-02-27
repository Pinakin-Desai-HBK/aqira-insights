import { useEffect, useState, useMemo } from "react";
import { VisTypes } from "src/insights/redux/types/schemas/dashboardVisualizations";
import {
  DashboardVisualizationDataUI,
  FilteredVisualizationProperties
} from "src/insights/redux/types/ui/dashboardVisualization";
import { useAppDispatch, useAppSelector } from "src/insights/redux/hooks/hooks";
import {
  selectStore_UI_Workspace_ResizingItemId,
  uiWorkspace_setItemDimensions
} from "src/insights/redux/slices/ui/workspace/workspaceSlice";
import { useProperties } from "src/insights/redux/hooks/useProperties";
import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";
import { filterProperties } from "./utils/filterProperties";
import { showHistogram2D, showHistogram3D } from "../temp";

export const useVisualizationDetailsContext = <T extends VisTypes>(tempInput: DashboardVisualizationDataUI) => {
  const appDispatch = useAppDispatch();
  const resizeItemId = useAppSelector(selectStore_UI_Workspace_ResizingItemId);
  const properties = useProperties(tempInput.identifier);
  const [details, setDetails] = useState<VisualizationDetails<T> | null>(null);

  const input: DashboardVisualizationDataUI = useMemo(() => {
    return showHistogram3D(tempInput)
      ? { ...tempInput, type: "Histogram3D" }
      : showHistogram2D(tempInput)
        ? { ...tempInput, type: "Histogram" }
        : tempInput;
  }, [tempInput]);

  useEffect(() => {
    const { id, name, identifier, type, minimumDimensions } = input;
    if (!properties) {
      return;
    }
    const filteredProperties: FilteredVisualizationProperties<T> = filterProperties<T>(properties, type);
    setDetails((current) => {
      const newDetails = {
        id,
        name,
        properties: filteredProperties,
        workspace: identifier.workspace,
        ...minimumDimensions,
        type: type as T
      };
      if (!current || JSON.stringify(current) !== JSON.stringify(newDetails)) {
        return newDetails;
      }
      return current;
    });
  }, [appDispatch, input, properties]);

  useEffect(() => {
    const { id } = input;
    const isResizing = resizeItemId === id;
    if (isResizing) {
      return;
    }

    const width = properties?.Width?.value;
    const height = properties?.Height?.value;
    const areDimensionsInvalid = typeof width !== "number" || typeof height !== "number";
    if (areDimensionsInvalid) {
      return;
    }
    appDispatch(uiWorkspace_setItemDimensions({ itemId: id, itemDimensions: { width, height } }));
  }, [appDispatch, input, properties, resizeItemId]);

  return { details };
};
