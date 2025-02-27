import { DragEvent, memo, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { parse as JSONBigParse } from "json-bigint";
import ReactFlow, {
  Background,
  BackgroundVariant,
  OnSelectionChangeFunc,
  useKeyPress,
  useReactFlow,
  Node,
  useStoreApi,
  Edge
} from "reactflow";
import NetworkCanvasCustomControls from "./custom-controls/NetworkCanvasCustomControls";
import "reactflow/dist/style.css";
import { useNetworkNodes } from "./useNetworkNodes";
import useNetworkConnections from "./useNetworkConnections";
import { DragAndDropDataFormat } from "../../../enums/enums";
import { useReactFlowConfig } from "../hooks/useReactFlowConfig";
import { useAppDispatch, useAppSelector } from "src/react/redux/hooks/hooks";
import {
  selectStore_UI_Workspace_CurrentlyDraggingProperties,
  selectStore_UI_Workspace_NodeTypesData,
  selectStore_UI_Workspace_SelectedWorkspaceItems,
  selectStore_UI_Workspace_Selecting,
  uiWorkspace_blockProperties,
  uiWorkspace_setKeys,
  uiWorkspace_setSelectedWorkspaceItems,
  uiWorkspace_setSelecting,
  uiWorkspace_unblockProperties
} from "src/react/redux/slices/ui/workspace/workspaceSlice";
import CanvasMiniMap from "../shared/CanvasMiniMap";
import { NetworkPaletteItemSize, networkReactFlowEdgeTypes, networkReactFlowTypes } from "src/react/consts/consts";
import { CurrentlyDraggingNodeDetails, TypedWorkspace } from "src/react/redux/types/redux/workspaces";
import { useRepositionView } from "../shared/useRepositionView";
import { insertNodeOnConnection } from "./edge/insertNodeOnConnection";
import { useCreateNetworkConnectionMutation, useDeleteNetworkConnectionMutation } from "src/react/redux/api/appApi";
import useAutoLayout from "./autolayout/useAutoLayout";
import { PropertiesData } from "src/react/redux/types/schemas/properties";
import {
  createGhostNodeForProximityEdge,
  findEdge,
  getCanvasPosition,
  getEdgeUnderMouse,
  getPortDetails,
  getPortDetailsFromPropertiesData,
  getProximityEdge,
  getProximityEdgeForPosition,
  insideBounds,
  setDataTransferEffect
} from "./interaction-utils";
import { NetworkNodeDataUI } from "src/react/redux/types/ui/networkNodes";
import useTheme from "@mui/material/styles/useTheme";

const NetworkContent = memo(({ workspace }: { workspace: TypedWorkspace<"Network"> }) => {
  const theme = useTheme();
  const { config, reactFlowInstance } = useReactFlowConfig({ workspace });
  const { runLayoutHandler } = useAutoLayout({
    algorithm: "elk",
    direction: "LR",
    spacing: [100, 100]
  });
  const { nodes, onNodesChange, createNetworkNode, createNetworkNodeWithConnections } = useNetworkNodes(
    reactFlowInstance || null,
    workspace
  );
  const { edges, onEdgeConnect, onEdgesChange, onEdgesDelete } = useNetworkConnections(
    reactFlowInstance || null,
    workspace
  );
  const appDispatch = useAppDispatch();
  const [mutateCreateNetworkEdge] = useCreateNetworkConnectionMutation();
  const [mutateDeleteNetworkEdge] = useDeleteNetworkConnectionMutation();
  const nodeTypes = useAppSelector(selectStore_UI_Workspace_NodeTypesData);
  const controlPressed = useKeyPress("Control");
  const shiftPressed = useKeyPress("Shift");
  const store = useStoreApi();
  const { getEdges, setEdges, setNodes } = useReactFlow();
  const currentlyDraggingPropertiesRaw = useAppSelector(selectStore_UI_Workspace_CurrentlyDraggingProperties);
  const [draggingPaletteNodeProperties, setDraggingPaletteNodeProperties] = useState<PropertiesData | null>(null);
  const insertionEdgeRef = useRef<HTMLElement | null>(null);
  const selecting = useAppSelector(selectStore_UI_Workspace_Selecting);
  const selectedWorkspaceItems = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItems);
  const repositionView = useRepositionView();
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const [currentlyDraggingNodeDetails, setCurrentlyDraggingNodeDetails] = useState<CurrentlyDraggingNodeDetails | null>(
    null
  );

  useEffect(() => {
    appDispatch(uiWorkspace_setKeys({ controlPressed, shiftPressed }));
  }, [controlPressed, appDispatch, shiftPressed]);

  useEffect(() => {
    if (currentlyDraggingPropertiesRaw) setDraggingPaletteNodeProperties(JSONBigParse(currentlyDraggingPropertiesRaw));
  }, [currentlyDraggingPropertiesRaw]);

  const onSelectionStart = useCallback(() => {
    appDispatch(uiWorkspace_setSelecting(true));
  }, [appDispatch]);

  const onSelectionEnd = useCallback(() => {
    appDispatch(uiWorkspace_setSelecting(false));
  }, [appDispatch]);

  const removeInsertionEdgeHighlight = useCallback((elemToCheck?: HTMLElement | null | undefined) => {
    if (insertionEdgeRef.current && (!elemToCheck || elemToCheck !== insertionEdgeRef.current)) {
      insertionEdgeRef.current.classList.remove("EdgeDragHoverAllowed");
      insertionEdgeRef.current.classList.remove("EdgeDragHoverNotAllowed");
      insertionEdgeRef.current = null;
    }
  }, []);

  const clearProximityEdge = useCallback(() => {
    setEdges((es) => es.filter((e) => e.className !== "temp"));
  }, [setEdges]);

  const clearTempNodeAndEdge = useCallback(() => {
    setEdges((es) => es.filter((e) => e.className !== "temp"));
    setNodes((ns) => ns.filter((n) => n.id !== "new_node"));
  }, [setEdges, setNodes]);

  const createPoximityEdge = useCallback(
    (proximityEdge: Edge, nodeData: NetworkNodeDataUI | null) => {
      if (proximityEdge.sourceHandle && proximityEdge.targetHandle)
        mutateCreateNetworkEdge({
          edgeDetails: {
            sourceNode:
              proximityEdge.source === "new_node" && nodeData
                ? nodeData.identifier.workspaceItem.id
                : proximityEdge.source,
            destinationNode:
              proximityEdge.target === "new_node" && nodeData
                ? nodeData.identifier.workspaceItem.id
                : proximityEdge.target,
            sourcePort: proximityEdge.sourceHandle,
            destinationPort: proximityEdge.targetHandle
          },
          workspace
        });
    },
    [mutateCreateNetworkEdge, workspace]
  );

  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes }) => {
      if (selecting) return;
      appDispatch(uiWorkspace_setSelectedWorkspaceItems(nodes));
      if (viewportContainerRef.current) repositionView(nodes, viewportContainerRef.current);
    },
    [appDispatch, repositionView, selecting]
  );

  const getProximityEdgeforNode = useCallback(
    (node: Node): Edge | null => {
      const { nodeInternals } = store.getState();
      const edges = getEdges();
      return getProximityEdge(edges, node, nodeInternals);
    },
    [getEdges, store]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const hasNodeType = event.dataTransfer.types.includes(DragAndDropDataFormat.Node);
      if (hasNodeType) {
        const { nodeInternals } = store.getState();
        const typeDataStr = event.dataTransfer.getData(DragAndDropDataFormat.Node);
        const insertionEdge = getEdgeUnderMouse(event);
        if (!insertionEdge) {
          const inside = insideBounds(event, reactFlowInstance, viewportContainerRef);
          const canvasPosition = getCanvasPosition(event, reactFlowInstance);
          const portDetails = draggingPaletteNodeProperties
            ? getPortDetailsFromPropertiesData(draggingPaletteNodeProperties)
            : null;
          if (canvasPosition && portDetails && inside) {
            const proximityEdge = getProximityEdgeForPosition(
              edges,
              canvasPosition,
              undefined,
              portDetails,
              nodeInternals
            );
            if (proximityEdge?.sourceHandle && proximityEdge?.targetHandle) {
              createNetworkNode({
                typeDataStr,
                event,
                callback: (nodeData) => createPoximityEdge(proximityEdge, nodeData)
              });
              return;
            }
          }
          createNetworkNode({ typeDataStr, event });
          return;
        }
        removeInsertionEdgeHighlight();
        if (
          !typeDataStr ||
          !draggingPaletteNodeProperties?.inputs?.length ||
          !draggingPaletteNodeProperties?.outputs?.length
        )
          return;
        event.preventDefault();
        event.stopPropagation();
        const edge = findEdge(getEdges(), insertionEdge.id);
        createNetworkNode({
          typeDataStr,
          event,
          callback: async (node) => {
            if (!draggingPaletteNodeProperties.inputs || !draggingPaletteNodeProperties.outputs || !edge?.data) return;
            insertNodeOnConnection({
              edge: edge.data,
              freeInputPorts: draggingPaletteNodeProperties.inputs,
              freeOutputPorts: draggingPaletteNodeProperties.outputs,
              mutateDeleteNetworkEdge,
              mutateCreateNetworkEdge,
              id: node.identifier.workspaceItem.id,
              workspace
            });
          }
        });
        clearTempNodeAndEdge();
      }
      const hasDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Data);
      if (!hasDataType) return;
      const filePaths = JSON.parse(event.dataTransfer.getData(DragAndDropDataFormat.Data));
      const hasFilePaths = filePaths && filePaths.length > 0;
      if (!hasFilePaths) return;
      if (event.ctrlKey) {
        const process = async (index: number) => {
          if (index >= filePaths.length) return;
          await createNetworkNodeWithConnections(filePaths[index], event, index);
          setTimeout(async () => {
            await process(index + 1);
          }, 100);
        };
        process(0);
      } else {
        createNetworkNodeWithConnections(filePaths, event);
      }
    },
    [
      clearTempNodeAndEdge,
      createNetworkNode,
      createNetworkNodeWithConnections,
      createPoximityEdge,
      draggingPaletteNodeProperties,
      edges,
      getEdges,
      mutateCreateNetworkEdge,
      mutateDeleteNetworkEdge,
      reactFlowInstance,
      removeInsertionEdgeHighlight,
      store,
      workspace
    ]
  );

  const onDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const inside = insideBounds(event, reactFlowInstance, viewportContainerRef);
      if (inside) return;
      clearTempNodeAndEdge();
    },
    [clearTempNodeAndEdge, reactFlowInstance]
  );

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const hasNodeType = event.dataTransfer.types.includes(DragAndDropDataFormat.Node);
      const hasDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Data);
      if (!hasNodeType && !hasDataType) setDataTransferEffect(event, "none", "none");
      if (hasNodeType) {
        setDataTransferEffect(event, "copy", "copy");
        const hasFreeInputAndOutputPorts =
          draggingPaletteNodeProperties?.inputs?.length && draggingPaletteNodeProperties?.outputs?.length;
        const insertionEdge = getEdgeUnderMouse(event);
        removeInsertionEdgeHighlight(insertionEdge);
        if (insertionEdge) {
          const value = hasFreeInputAndOutputPorts ? "link" : "none";
          setDataTransferEffect(event, value, value);
          insertionEdgeRef.current = insertionEdge;
          insertionEdge.classList.add(!hasFreeInputAndOutputPorts ? "EdgeDragHoverNotAllowed" : "EdgeDragHoverAllowed");
          clearTempNodeAndEdge();
          return;
        }
        removeInsertionEdgeHighlight();
        const inside = insideBounds(event, reactFlowInstance, viewportContainerRef);
        const canvasPosition = getCanvasPosition(event, reactFlowInstance);
        if (
          !draggingPaletteNodeProperties ||
          !draggingPaletteNodeProperties.inputs ||
          !draggingPaletteNodeProperties.outputs ||
          !inside ||
          !canvasPosition
        ) {
          clearTempNodeAndEdge();
          return;
        }
        const { nodeInternals } = store.getState();
        const portDetails = getPortDetailsFromPropertiesData(draggingPaletteNodeProperties);
        if (!portDetails) {
          clearTempNodeAndEdge();
          return;
        }
        const proximityEdge = getProximityEdgeForPosition(edges, canvasPosition, undefined, portDetails, nodeInternals);
        if (!proximityEdge) {
          clearTempNodeAndEdge();
          return;
        }
        proximityEdge.className = "temp";
        const position = {
          x: canvasPosition.x - NetworkPaletteItemSize / 2,
          y: canvasPosition.y - NetworkPaletteItemSize / 2
        };
        const ghostNode = createGhostNodeForProximityEdge(
          position,
          draggingPaletteNodeProperties.inputs,
          draggingPaletteNodeProperties.outputs,
          proximityEdge
        );
        setNodes((ns) => {
          setEdges((es) => {
            const nextEdges = es.filter((e) => e.className !== "temp");
            nextEdges.push(proximityEdge);
            return nextEdges;
          });
          if (!ghostNode) return ns;
          const existingGhostNode = ns.find((n) => n.id === "new_node");
          if (existingGhostNode) {
            existingGhostNode.position = position;
            return ns;
          }
          const nextNodes = ns;
          nextNodes.push(ghostNode);
          return nextNodes;
        });
        return;
      } else clearTempNodeAndEdge();
      if (hasDataType) {
        const value = event.ctrlKey ? "move" : "copy";
        setDataTransferEffect(event, value, value);
        return;
      }
    },
    [
      removeInsertionEdgeHighlight,
      clearTempNodeAndEdge,
      draggingPaletteNodeProperties,
      edges,
      reactFlowInstance,
      setEdges,
      setNodes,
      store
    ]
  );

  const onNodeDragStart = useCallback(
    (event: MouseEvent, node: Node, nodes: Node<NetworkNodeDataUI>[]) => {
      if (nodes.length > 1) {
        return;
      }
      const edges = getEdges();
      const portDetails = getPortDetails(edges, node);
      setCurrentlyDraggingNodeDetails({
        id: node.id,
        ...portDetails
      });
    },
    [getEdges]
  );

  const onNodeDrag = useCallback(
    (event: MouseEvent, node: Node) => {
      appDispatch(uiWorkspace_blockProperties());
      const edges = getEdges();
      const portDetails = getPortDetails(edges, node);
      const hasFreeInputAndOutputPorts = portDetails.hasFreeInputAndOutputPorts;
      const insertionEdge = getEdgeUnderMouse(event);
      removeInsertionEdgeHighlight(insertionEdge);
      if (insertionEdge) {
        insertionEdgeRef.current = insertionEdge;
        insertionEdge.classList.add(!hasFreeInputAndOutputPorts ? "EdgeDragHoverNotAllowed" : "EdgeDragHoverAllowed");
        clearProximityEdge();
        return;
      }
      removeInsertionEdgeHighlight();
      const proximityEdge = getProximityEdgeforNode(node);
      if (proximityEdge) {
        setEdges((es) => {
          const nextEdges = es.filter((e) => e.className !== "temp");
          if (
            proximityEdge &&
            !nextEdges.find((ne) => ne.source === proximityEdge.source && ne.target === proximityEdge.target)
          ) {
            proximityEdge.className = "temp";
            nextEdges.push(proximityEdge);
          }
          return nextEdges;
        });
      } else clearProximityEdge();
    },
    [appDispatch, removeInsertionEdgeHighlight, clearProximityEdge, getEdges, getProximityEdgeforNode, setEdges]
  );

  const onNodeDragStop = useCallback(
    (event: MouseEvent, node: Node) => {
      appDispatch(uiWorkspace_unblockProperties());
      const connectionDropEdge = {
        allowed: document.getElementsByClassName("EdgeDragHoverAllowed"),
        notAllowed: document.getElementsByClassName("EdgeDragHoverNotAllowed")
      };
      if (currentlyDraggingNodeDetails) {
        if (currentlyDraggingNodeDetails.hasFreeInputAndOutputPorts) {
          const edge = findEdge(getEdges(), connectionDropEdge.allowed[0]?.id);
          if (edge && edge.data) {
            insertNodeOnConnection({
              freeInputPorts: currentlyDraggingNodeDetails.freeInputPorts,
              freeOutputPorts: currentlyDraggingNodeDetails.freeOutputPorts,
              mutateCreateNetworkEdge,
              mutateDeleteNetworkEdge,
              edge: {
                ...edge.data,
                workspace
              },
              workspace,
              id: currentlyDraggingNodeDetails.id
            });
            clearProximityEdge();
            removeInsertionEdgeHighlight();
            setCurrentlyDraggingNodeDetails(null);
            return;
          }
        }
      }
      if (connectionDropEdge.notAllowed.length === 0) {
        const proximityEdge = getProximityEdgeforNode(node);
        if (proximityEdge) createPoximityEdge(proximityEdge, null);
      }
      clearProximityEdge();
      removeInsertionEdgeHighlight();
      setCurrentlyDraggingNodeDetails(null);
    },
    [
      appDispatch,
      clearProximityEdge,
      createPoximityEdge,
      currentlyDraggingNodeDetails,
      getEdges,
      getProximityEdgeforNode,
      mutateCreateNetworkEdge,
      mutateDeleteNetworkEdge,
      removeInsertionEdgeHighlight,
      workspace
    ]
  );

  const arrangeNodes = useCallback(() => {
    if (nodes && edges) runLayoutHandler.current(nodes, edges, workspace);
  }, [nodes, edges, runLayoutHandler, workspace]);

  return nodeTypes ? (
    <ReactFlow
      {...config}
      ref={viewportContainerRef}
      nodes={nodes}
      edges={edges}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgesDelete={onEdgesDelete}
      onConnect={onEdgeConnect}
      onSelectionChange={onSelectionChange}
      onSelectionStart={onSelectionStart}
      onSelectionEnd={onSelectionEnd}
      nodeTypes={networkReactFlowTypes}
      edgeTypes={networkReactFlowEdgeTypes}
      edgesUpdatable={!shiftPressed}
      edgesFocusable={!shiftPressed}
      nodesDraggable={!shiftPressed}
      nodesConnectable={!shiftPressed}
      nodesFocusable={!shiftPressed}
      elementsSelectable={!shiftPressed}
      snapToGrid={false}
    >
      <NetworkCanvasCustomControls workspace={workspace} arrangeNodes={arrangeNodes} />
      {selectedWorkspaceItems.length !== 1 ? (
        <CanvasMiniMap label="Network Overview" nodeBorderRadius={50} zoomStep={10} paletteData={nodeTypes} />
      ) : null}
      <Background color={theme.palette.canvas.background} variant={BackgroundVariant.Lines} />
    </ReactFlow>
  ) : null;
});
NetworkContent.displayName = "NetworkContent";

export default NetworkContent;
