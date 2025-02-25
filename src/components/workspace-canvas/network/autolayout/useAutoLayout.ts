import { useCallback, useEffect, useRef } from "react";
import { type Node, type Edge, useReactFlow } from "reactflow";

import { getSourceHandlePosition, getTargetHandlePosition } from "./utils";
import layoutAlgorithms, { type LayoutAlgorithmOptions } from "./algorithms";
import { useUpdateWorkspaceItemPositionMutation } from "src/redux/api/appApi";
import { preparePosition } from "../../utils/preparePosition";
import { NetworkNodeDataUI } from "src/redux/types/ui/networkNodes";
import { Workspace } from "src/redux/types/schemas/project";

export type LayoutOptions = {
  algorithm: keyof typeof layoutAlgorithms;
} & LayoutAlgorithmOptions;

function useAutoLayout(options: LayoutOptions) {
  const { setNodes, setEdges, fitView } = useReactFlow();
  const [mutateUpdateNodePosition] = useUpdateWorkspaceItemPositionMutation();

  const runLayoutHandler = useCallback(
    async (nodes: Node<NetworkNodeDataUI>[], edges: Edge[], workspace: Workspace) => {
      const layoutAlgorithm = layoutAlgorithms[options.algorithm];

      const { nodes: nextNodes, edges: nextEdges } = await layoutAlgorithm(nodes, edges, options);

      for (const node of nextNodes) {
        node.style = { ...node.style, opacity: 1 };
        node.sourcePosition = getSourceHandlePosition(options.direction);
        node.targetPosition = getTargetHandlePosition(options.direction);
      }

      for (const edge of edges) {
        edge.style = { ...edge.style, opacity: 1 };
      }

      setNodes(nextNodes);
      setEdges(nextEdges);

      setTimeout(async () => {
        await Promise.all(
          nextNodes.map(async (node) => {
            if (node.type)
              await mutateUpdateNodePosition({
                workspaceItem: { id: node.id, type: node.type },
                workspace,
                newPosition: preparePosition(node.position)
              });
          })
        );
        setTimeout(() => {
          fitView();
        }, 0);
      }, 0);
    },
    [options, setNodes, setEdges, mutateUpdateNodePosition, fitView]
  );

  const runLayoutHandlerRef = useRef(runLayoutHandler);

  useEffect(() => {
    runLayoutHandlerRef.current = runLayoutHandler;
  }, [runLayoutHandler]);
  return {
    runLayoutHandler: runLayoutHandlerRef
  };
}

export default useAutoLayout;
