import { applyNodeChanges, Node, NodeChange, NodePositionChange, ReactFlowInstance } from "reactflow";
import { DragEvent, useCallback, useEffect, useState } from "react";
import {
  useCreateNetworkNodeMutation,
  useDeleteWorkspaceItemMutation,
  useGetNetworkWorkspaceItemsQuery,
  useUpdatePropertyMutation,
  useUpdateWorkspaceItemPositionMutation
} from "src/react/redux/api/appApi";
import { useAppSelector } from "src/react/redux/hooks/hooks";
import { NETWORK_CONNECTION_FILE_PREFIX, NETWORK_INPUT_NODE, NetworkPaletteItemSize } from "src/react/consts/consts";
import {
  selectStore_UI_Workspace_NodeTypesData,
  selectStore_UI_Workspace_SelectedWorkspaceItemsIds
} from "src/react/redux/slices/ui/workspace/workspaceSlice";
import { getTypeDiscriminator, getValue } from "../../properties/property/usePropertyUtils";
import { preparePosition } from "../utils/preparePosition";
import { CreateNodeParams, NetworkNodeDataUI } from "src/react/redux/types/ui/networkNodes";
import { useDebouncedCallback } from "use-debounce";
import { TypedWorkspace } from "src/react/redux/types/redux/workspaces";

export const useNetworkNodes = (reactFlowInstance: ReactFlowInstance | null, workspace: TypedWorkspace<"Network">) => {
  const [mutateDeleteNode] = useDeleteWorkspaceItemMutation();
  const [mutateUpdateNodePosition] = useUpdateWorkspaceItemPositionMutation();
  const [mutateCreateNetworkNode] = useCreateNetworkNodeMutation();
  const [updatePropertyMutation] = useUpdatePropertyMutation();
  const typesData = useAppSelector(selectStore_UI_Workspace_NodeTypesData);
  if (!typesData) {
    throw new Error("Node types not loaded");
  }
  const selectedWorkspaceItemsIds = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItemsIds);
  const { data: loadedNodes } = useGetNetworkWorkspaceItemsQuery({
    workspace,
    selectedWorkspaceItemsIds,
    typesData
  });
  const [nodes, setNodes] = useState<Node[]>(loadedNodes?.workspaceItems || []);

  useEffect(() => {
    setNodes(loadedNodes?.workspaceItems || []);
  }, [loadedNodes]);

  const updatePositionsHandler = useCallback(
    async (nodes: Node[], changes: NodePositionChange[]) => {
      await Promise.all(
        changes.map(async ({ id, dragging }) => {
          const found = nodes.find((node) => node.id === id);
          if (!found || !found.type || dragging) return;
          await mutateUpdateNodePosition({
            workspaceItem: { id: found.id, type: found.type },
            workspace,
            newPosition: preparePosition(found.position)
          });
        })
      );
    },
    [mutateUpdateNodePosition, workspace]
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

  const onNodesChange = useCallback(
    async (changes: NodeChange[]) => {
      changes
        .filter((n) => n.type === "remove")
        .forEach((change) => {
          const found = nodes.find((node) => node.id === change.id);
          if (!found) return;
          mutateDeleteNode({ workspaceItem: { id: change.id, type: change.type }, workspace });
        });
      setTimeout(() => {
        if (updatePositions.isPending()) updatePositions.cancel();
        updatePositions(
          nodes,
          changes.filter((n) => n.type === "position")
        );
        setNodes((ns) =>
          applyNodeChanges(
            changes.filter((n) => n.type !== "remove"),
            ns
          )
        );
      }, 0);
    },
    [nodes, mutateDeleteNode, workspace, updatePositions]
  );

  const addNodeToNetwork = useCallback(
    async ({ payload, callback }: CreateNodeParams) => {
      const { data: networkNode } = await mutateCreateNetworkNode({ workspace, payload });
      if (networkNode && callback)
        await callback({ ...networkNode, identifier: { workspace, workspaceItem: networkNode } });
    },
    [mutateCreateNetworkNode, workspace]
  );

  const createNetworkNode = useCallback(
    ({
      callback,
      event,
      typeDataStr
    }: {
      typeDataStr: string;
      event: DragEvent<HTMLDivElement>;
      callback?: ((node: NetworkNodeDataUI) => void) | undefined;
    }) => {
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      position.x = Math.floor(position.x - NetworkPaletteItemSize / 2);
      position.y = Math.floor(position.y - NetworkPaletteItemSize / 2);
      const typeData = JSON.parse(typeDataStr);
      addNodeToNetwork({ payload: { type: typeData.type, position }, callback });
    },
    [addNodeToNetwork, reactFlowInstance]
  );

  const setInputNodeConnection = useCallback(
    async (workspaceItem: NetworkNodeDataUI, file: string) => {
      const newConnections = [`${NETWORK_CONNECTION_FILE_PREFIX}${file}`];
      await updatePropertyMutation({
        item: { workspace, workspaceItem },
        propertyName: "Connections",
        details: {
          type: getTypeDiscriminator(newConnections),
          value: getValue(newConnections)
        }
      });
    },
    [updatePropertyMutation, workspace]
  );

  const setInputNodeConnections = useCallback(
    async (workspaceItem: NetworkNodeDataUI, files: string[]) => {
      const newConnections = files.map((file) => `${NETWORK_CONNECTION_FILE_PREFIX}${file}`);
      await updatePropertyMutation({
        item: { workspace, workspaceItem },
        propertyName: "Connections",
        details: {
          type: getTypeDiscriminator(newConnections),
          value: getValue(newConnections)
        }
      });
    },
    [updatePropertyMutation, workspace]
  );

  const createNetworkNodeWithConnections = useCallback(
    async (filePaths: string | string[], event: DragEvent<HTMLDivElement>, offsetIndex?: number) => {
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      position.x = Math.floor(position.x - NetworkPaletteItemSize / 2);
      position.y =
        Math.floor(position.y - NetworkPaletteItemSize / 2) +
        (offsetIndex ? offsetIndex * (NetworkPaletteItemSize + 30) : 0);
      await addNodeToNetwork({
        payload: { type: NETWORK_INPUT_NODE, position },
        callback: async (nodeId) => {
          if (filePaths && Array.isArray(filePaths)) {
            await setInputNodeConnections(nodeId, filePaths);
          } else {
            await setInputNodeConnection(nodeId, filePaths);
          }
        }
      });
    },
    [addNodeToNetwork, reactFlowInstance, setInputNodeConnection, setInputNodeConnections]
  );

  return {
    nodes,
    createNetworkNode,
    onNodesChange,
    createNetworkNodeWithConnections
  };
};
