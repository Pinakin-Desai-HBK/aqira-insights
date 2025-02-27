import { memo, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  OnSelectionChangeFunc,
  ReactFlowInstance,
  useKeyPress
} from "reactflow";
import "reactflow/dist/style.css";
import useDashboardVisualizations from "./useDashboardVisualizations";
import { DragAndDropDataFormat } from "../../../enums/enums";
import DashboardCanvasCustomControls from "./custom-controls/DashboardCanvasCustomControls";
import { useReactFlowConfig } from "../hooks/useReactFlowConfig";
import { useAppDispatch, useAppSelector } from "src/insights/redux/hooks/hooks";
import {
  selectStore_UI_Workspace_Locked,
  selectStore_UI_Workspace_SelectedWorkspaceItems,
  selectStore_UI_Workspace_Selecting,
  selectStore_UI_Workspace_VisualizationTypesData,
  uiWorkspace_setKeys,
  uiWorkspace_setLocked,
  uiWorkspace_setSelectedWorkspaceItems,
  uiWorkspace_setSelecting
} from "src/insights/redux/slices/ui/workspace/workspaceSlice";
import CanvasMiniMap from "../shared/CanvasMiniMap";
import {
  DASHBOARD_CONNECTION_FILE_PREFIX,
  DASHBOARD_SNAP_INTERVAL,
  dashboardReactFlowTypes,
  NETWORK_CONNECTION_FILE_PREFIX
} from "src/insights/consts/consts";
import { TypedWorkspace } from "src/insights/redux/types/redux/workspaces";
import usePubSubManager from "src/insights/pubsub-manager/usePubSubManager";
import { SubscriberTypes } from "src/insights/redux/types/system/pub-sub";
import { popoutDetails } from "src/insights/popoutDetails";
import { Icon } from "src/insights/components/icon/Icon";
import { isDataVisualizationByType } from "src/insights/components/dashboard-visualization/utils/isDataVisualization";
import { getTypeDiscriminator, getValue } from "src/insights/components/properties/property/usePropertyUtils";
import { useUpdatePropertyMutation } from "src/insights/redux/api/appApi";
import { selectStore_UI_DataPanel_DragAndDrop } from "src/insights/redux/slices/ui/dataPanel/dataPanelSlice";
import { useRepositionView } from "../shared/useRepositionView";
import useTheme from "@mui/material/styles/useTheme";

const getDataValue = (event: React.DragEvent<HTMLDivElement>) => {
  const hasFileDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Data);
  const hasDisplayDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Display);

  if (hasDisplayDataType) {
    const { displayNode } = JSON.parse(event.dataTransfer.getData(DragAndDropDataFormat.Display));
    return `${DASHBOARD_CONNECTION_FILE_PREFIX}${displayNode}`;
  }

  if (hasFileDataType) {
    const filePaths = JSON.parse(event.dataTransfer.getData(DragAndDropDataFormat.Data));
    if (filePaths.length === 0) return null;
    return `${NETWORK_CONNECTION_FILE_PREFIX}${filePaths[0]}`;
  }

  return null;
};

const useDataToVisSpeedDial = ({
  reactFlowInstance,
  workspace
}: {
  reactFlowInstance: ReactFlowInstance | undefined;
  workspace: TypedWorkspace<"Dashboard">;
}) => {
  const { popoutId, isPopout } = popoutDetails;
  const pubsub = usePubSubManager();
  const visualizationTypes = useAppSelector(selectStore_UI_Workspace_VisualizationTypesData);
  const { createDashboardVisualizationByType } = useDashboardVisualizations(reactFlowInstance || null, workspace);
  const [updatePropertyMutation] = useUpdatePropertyMutation();
  const openDataToVisSpeedDial = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const value = getDataValue(event);
      if (!value) return;
      const options =
        visualizationTypes && visualizationTypes.itemsMap
          ? Object.keys(visualizationTypes.itemsMap)
              .map((key) => {
                const item = visualizationTypes.itemsMap[key];
                return item && isDataVisualizationByType(item.type)
                  ? {
                      id: item.type,
                      icon: (
                        <Icon
                          src={`data:image/svg+xml;base64,${btoa(item.icon)}`}
                          style={{ width: "26px", height: "auto", fill: "#000", stroke: "#000", color: "#000" }}
                        />
                      ),
                      title: item.name || item.type || ""
                    }
                  : undefined;
              })
              .filter((item) => item !== undefined)
          : [];

      pubsub.publish(
        "OpenGlobalSpeedDial",
        {
          targetSubscriberType: isPopout ? SubscriberTypes.POPUP : SubscriberTypes.MAIN,
          id: popoutId || SubscriberTypes.MAIN,
          position: { x: event.clientX, y: window.innerHeight - event.clientY },
          onClose: () => {
            //
          },
          onSelection: (type: string) => {
            if (!type) return;
            setTimeout(() => {
              createDashboardVisualizationByType(type, event, (id) => {
                updatePropertyMutation({
                  item: { workspace, workspaceItem: { type, id } },
                  propertyName: "Connection",
                  details: {
                    type: getTypeDiscriminator(value),
                    value: getValue(value),
                    networkRun: true
                  }
                });
              });
            }, 0);
          },
          options //: [...options, ...options, ...options]
        },
        popoutId
      );
    },
    [
      createDashboardVisualizationByType,
      isPopout,
      popoutId,
      pubsub,
      updatePropertyMutation,
      visualizationTypes,
      workspace
    ]
  );
  return openDataToVisSpeedDial;
};

const DashboardContent = memo(({ workspace }: { workspace: TypedWorkspace<"Dashboard"> }) => {
  const theme = useTheme();
  const locked = useAppSelector(selectStore_UI_Workspace_Locked);
  const dragAndDrop = useAppSelector(selectStore_UI_DataPanel_DragAndDrop);
  const { config, reactFlowInstance } = useReactFlowConfig({ workspace });
  const { visualizations, onVisualizationsChange, createDashboardVisualization } = useDashboardVisualizations(
    reactFlowInstance || null,
    workspace
  );
  const appDispatch = useAppDispatch();
  const openDataToVisSpeedDial = useDataToVisSpeedDial({ reactFlowInstance, workspace });

  const controlPressed = useKeyPress("Control");
  const shiftPressed = useKeyPress("Shift");

  useEffect(() => {
    appDispatch(uiWorkspace_setKeys({ controlPressed, shiftPressed }));
  }, [controlPressed, appDispatch, shiftPressed]);

  const visualizationTypes = useAppSelector(selectStore_UI_Workspace_VisualizationTypesData);
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (locked) {
        appDispatch(uiWorkspace_setLocked(false));
      }
      const visDataStr = event.dataTransfer.getData(DragAndDropDataFormat.Visualization);
      if (visDataStr) createDashboardVisualization(visDataStr, event);
      openDataToVisSpeedDial(event);
    },
    [locked, createDashboardVisualization, openDataToVisSpeedDial, appDispatch]
  );

  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const hasType =
        event.dataTransfer.types.includes(DragAndDropDataFormat.Visualization) ||
        (event.dataTransfer.types.includes(DragAndDropDataFormat.Data) && dragAndDrop.count === 1) ||
        event.dataTransfer.types.includes(DragAndDropDataFormat.Display);
      if (!hasType) {
        event.dataTransfer.dropEffect = "none";
        event.dataTransfer.effectAllowed = "none";
      } else {
        event.dataTransfer.dropEffect = "copy";
        event.dataTransfer.effectAllowed = "copy";
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [dragAndDrop.count]
  );

  const selecting = useAppSelector(selectStore_UI_Workspace_Selecting);

  const onSelectionStart = useCallback(() => {
    appDispatch(uiWorkspace_setSelecting(true));
  }, [appDispatch]);

  const onSelectionEnd = useCallback(() => {
    appDispatch(uiWorkspace_setSelecting(false));
  }, [appDispatch]);

  const selectedWorkspaceItems = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItems);
  const repositionView = useRepositionView();
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes }) => {
      if (selecting) return;
      appDispatch(uiWorkspace_setSelectedWorkspaceItems(nodes.filter((node) => node.selected)));
      if (viewportContainerRef.current) repositionView(nodes, viewportContainerRef.current);
    },
    [selecting, appDispatch, repositionView]
  );

  return visualizationTypes ? (
    <ReactFlow
      {...config}
      ref={viewportContainerRef}
      nodes={visualizations}
      edges={[]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodesChange={onVisualizationsChange}
      nodeTypes={dashboardReactFlowTypes}
      edgesUpdatable={!locked && !shiftPressed}
      edgesFocusable={!locked && !shiftPressed}
      nodesDraggable={!locked && !shiftPressed}
      onSelectionChange={onSelectionChange}
      onSelectionStart={onSelectionStart}
      onSelectionEnd={onSelectionEnd}
      nodesConnectable={!locked && !shiftPressed}
      nodesFocusable={!locked && !shiftPressed}
      elementsSelectable={!locked && !shiftPressed}
      snapGrid={[DASHBOARD_SNAP_INTERVAL, DASHBOARD_SNAP_INTERVAL]}
      snapToGrid={true}
    >
      <DashboardCanvasCustomControls reactFlowInstance={reactFlowInstance} workspace={workspace} />
      {selectedWorkspaceItems.length !== 1 || locked ? (
        <CanvasMiniMap
          label="Dashboard Overview"
          nodeBorderRadius={0}
          zoomStep={0.5}
          paletteData={visualizationTypes}
        />
      ) : null}
      {locked ? null : (
        <Background
          color={theme.palette.canvas.background}
          variant={BackgroundVariant.Lines}
          style={{ cursor: "default" }}
        />
      )}
    </ReactFlow>
  ) : null;
});
DashboardContent.displayName = "DashboardContent";

export default DashboardContent;
