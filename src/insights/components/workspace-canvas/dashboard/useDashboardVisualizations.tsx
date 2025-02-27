import {
  NodeChange as VisualizationChange,
  ReactFlowInstance,
  applyNodeChanges as applyVisualizationChanges,
  Node,
  NodePositionChange
} from "reactflow";
import { DragEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  useCreateDashboardVisualizationMutation,
  useDeleteWorkspaceItemMutation,
  useGetDashboardWorkspaceItemsQuery,
  useUpdateWorkspaceItemPositionMutation
} from "src/insights/redux/api/appApi";
import { useAppSelector } from "src/insights/redux/hooks/hooks";
import {
  CreateVisualizationParams,
  DashboardVisualizationDataUI
} from "src/insights/redux/types/ui/dashboardVisualization";
import { DashboardPaletteItemSize } from "src/insights/consts/consts";
import { preparePosition } from "../utils/preparePosition";
import { make_selectStore_UI_Workspace_ForUseDashboardsVisualizationsHook } from "src/insights/redux/slices/ui/workspace/combinedSelectors";
import {
  selectStore_UI_Workspace_SelectedWorkspaceItemsIds,
  selectStore_UI_Workspace_VisualizationTypesData
} from "src/insights/redux/slices/ui/workspace/workspaceSlice";
import { TypedWorkspace } from "src/insights/redux/types/redux/workspaces";
import { useDebouncedCallback } from "use-debounce";

const useDashboardVisualizations = (
  reactFlowInstance: ReactFlowInstance | null,
  workspace: TypedWorkspace<"Dashboard">
) => {
  const [mutateDeleteVisualization] = useDeleteWorkspaceItemMutation();
  const [mutateUpdateVisualizationPosition] = useUpdateWorkspaceItemPositionMutation();
  const [mutateCreateDashboardVisualization] = useCreateDashboardVisualizationMutation();
  const selectedWorkspaceItemsIds = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItemsIds);
  const typesData = useAppSelector(selectStore_UI_Workspace_VisualizationTypesData);
  if (!typesData) {
    throw new Error("Node types not loaded");
  }
  const { data: loadedVisualizations } = useGetDashboardWorkspaceItemsQuery({
    workspace,
    selectedWorkspaceItemsIds,
    typesData
  });
  const projectSelector = useMemo(make_selectStore_UI_Workspace_ForUseDashboardsVisualizationsHook, []);
  const { resizingItemId } = useAppSelector(projectSelector);
  const [visualizations, setVisualizations] = useState<Node<DashboardVisualizationDataUI>[]>(
    loadedVisualizations?.workspaceItems || []
  );

  useEffect(() => {
    setVisualizations(loadedVisualizations?.workspaceItems || []);
  }, [loadedVisualizations]);

  const updatePositionsHandler = useCallback(
    async (visualizations: Node[], changes: NodePositionChange[], resizingItemId: string | null) => {
      await Promise.all(
        changes.map(async ({ id, dragging }) => {
          const found = visualizations.find((visualization) => visualization.id === id);
          if (!found || !found.type || resizingItemId === id || dragging) return;
          await mutateUpdateVisualizationPosition({
            workspaceItem: { id: found.id, type: found.type },
            workspace,
            newPosition: preparePosition(found.position)
          });
        })
      );
    },
    [mutateUpdateVisualizationPosition, workspace]
  );

  const updatePositions = useDebouncedCallback(updatePositionsHandler, 100, {
    leading: false,
    trailing: true,
    maxWait: 50
  });

  useEffect(
    () => () => {
      updatePositions.flush();
    },
    [updatePositions]
  );

  const onVisualizationsChange = useCallback(
    async (changes: VisualizationChange[]) => {
      changes
        .filter((n) => n.type === "remove")
        .forEach((change) => {
          const found = visualizations.find((visualization) => visualization.id === change.id);
          if (!found) return;
          mutateDeleteVisualization(found.data.identifier);
        });
      setTimeout(() => {
        if (updatePositions.isPending()) updatePositions.cancel();
        updatePositions(
          visualizations,
          changes.filter((n) => n.type === "position"),
          resizingItemId
        );
        setVisualizations((ns) =>
          applyVisualizationChanges(
            changes.filter((n) => n.type !== "remove"),
            ns
          )
        );
      }, 0);
    },
    [visualizations, mutateDeleteVisualization, updatePositions, resizingItemId]
  );

  const addVisualizationToDashboard = useCallback(
    async ({ payload, callback }: CreateVisualizationParams) => {
      const { data: dashboardVisualization } = await mutateCreateDashboardVisualization({ workspace, payload });
      if (dashboardVisualization && callback) await callback(dashboardVisualization.id);
    },
    [mutateCreateDashboardVisualization, workspace]
  );

  const createDashboardVisualizationByType = useCallback(
    (type: string, event: DragEvent<HTMLDivElement>, callback?: (id: string) => void) => {
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      position.x = Math.floor(position.x - DashboardPaletteItemSize / 2);
      position.y = Math.floor(position.y - DashboardPaletteItemSize / 2);
      addVisualizationToDashboard({ payload: { type, position }, ...(callback ? { callback } : {}) });
    },
    [addVisualizationToDashboard, reactFlowInstance]
  );

  const createDashboardVisualization = useCallback(
    (typeDataStr: string, event: DragEvent<HTMLDivElement>) => {
      const { type } = JSON.parse(typeDataStr);
      createDashboardVisualizationByType(type, event);
    },
    [createDashboardVisualizationByType]
  );

  return { visualizations, createDashboardVisualization, onVisualizationsChange, createDashboardVisualizationByType };
};

export default useDashboardVisualizations;
