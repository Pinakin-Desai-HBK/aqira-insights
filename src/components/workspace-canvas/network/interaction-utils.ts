import { DragEvent, MouseEvent } from "react";
import { Edge, Node, NodeInternals, ReactFlowInstance, XYPosition } from "reactflow";
import { PropertiesData } from "src/redux/types/schemas/properties";
import { NetworkNodeDataUI } from "src/redux/types/ui/networkNodes";

const MIN_DISTANCE = 150;

const getConnectionCounts = (edges: Edge[], node: Node<NetworkNodeDataUI>) => {
  const outputConnections = edges.filter((edge) => {
    return edge.source === node.id && edge.className !== "temp";
  });
  const inputConnections = edges.filter((edge) => {
    return edge.target === node.id && edge.className !== "temp";
  });
  return {
    outputConnections: outputConnections.length,
    inputConnections: inputConnections.length
  };
};

type NodePortDetails = {
  hasUsedPorts: boolean;
  hasUsedInputPorts: boolean;
  hasUsedOutputPorts: boolean;
  hasFreeInputAndOutputPorts: boolean;
  hasFreeInputPorts: boolean;
  hasFreeOutputPorts: boolean;
  outputConnections: number;
  inputConnections: number;
  inputPorts: { name: string }[];
  outputPorts: { name: string }[];
  freeInputPorts: string[];
  freeOutputPorts: string[];
};

export const getPortDetails = (edges: Edge[], node: Node<NetworkNodeDataUI>): NodePortDetails => {
  const { inputConnections, outputConnections } = getConnectionCounts(edges, node);
  const inputPorts = node.data.inputPorts || [];
  const outputPorts = node.data.outputPorts || [];
  const hasFreeInputPorts = inputPorts.length > 0 && inputPorts.length > inputConnections;
  const hasFreeOutputPorts = outputPorts.length > 0 && outputPorts.length > outputConnections;
  const hasFreeInputAndOutputPorts = hasFreeInputPorts && hasFreeOutputPorts;
  const { freeInputPorts, freeOutputPorts } = getFreePorts(edges, node);
  return {
    hasUsedPorts: inputConnections > 0 || outputConnections > 0,
    hasUsedInputPorts: inputConnections > 0,
    hasUsedOutputPorts: outputConnections > 0,
    hasFreeInputAndOutputPorts,
    hasFreeInputPorts,
    hasFreeOutputPorts,
    outputConnections,
    inputConnections,
    inputPorts,
    outputPorts,
    freeInputPorts,
    freeOutputPorts
  };
};

const getFreePorts = (edges: Edge[], node: Node) => {
  const freeOutputPorts = node.data.outputPorts
    .filter((port: { name: string }) => {
      const matched = edges.find((edge) => {
        return edge.source === node.data.id && edge.sourceHandle === port.name && edge.className !== "temp";
      });
      return !matched;
    })
    .map((port: { name: string }) => port.name);
  const freeInputPorts = node.data.inputPorts
    .filter((port: { name: string }) => {
      const matched = edges.find((edge) => {
        return edge.target === node.data.id && edge.targetHandle === port.name && edge.className !== "temp";
      });
      return !matched;
    })
    .map((port: { name: string }) => port.name);
  return {
    freeInputPorts,
    freeOutputPorts
  };
};

export const getProximityEdge = (edges: Edge[], node: Node, nodeInternals: NodeInternals): Edge | null => {
  const internalNode = nodeInternals.get(node.id);
  const nodePortDetails = getPortDetails(edges, node);
  if (!nodePortDetails.hasFreeInputPorts && !nodePortDetails.hasFreeOutputPorts) {
    return null;
  }

  const position = internalNode?.positionAbsolute;
  if (!internalNode || !position) {
    return null;
  }

  return getProximityEdgeForPosition(edges, position, internalNode.id, nodePortDetails, nodeInternals);
};

export const getProximityEdgeForPosition = (
  edges: Edge[],
  position: XYPosition,
  id: string | undefined,
  nodePortDetails: NodePortDetails,
  nodeInternals: NodeInternals
): Edge | null => {
  const closestNode = Array.from(nodeInternals.keys()).reduce(
    (res, k) => {
      const n = nodeInternals.get(k);
      if (
        n &&
        typeof n !== "string" &&
        n.id !== "new_node" &&
        (id === undefined || n.id !== id) &&
        n.positionAbsolute
      ) {
        const dx = n.positionAbsolute.x - position.x;
        const dy = n.positionAbsolute.y - position.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < res.distance && d < MIN_DISTANCE) {
          const wouldBeSource = n.positionAbsolute.x < position.x;
          const areNodePortsAvailable = wouldBeSource
            ? nodePortDetails.freeInputPorts.length > 0
            : nodePortDetails.freeOutputPorts.length > 0;
          const nPortDetails = getPortDetails(edges, n);
          const areNPortsAvailable = wouldBeSource
            ? nPortDetails.freeOutputPorts.length > 0
            : nPortDetails.freeInputPorts.length > 0;
          if (areNodePortsAvailable && areNPortsAvailable) {
            res.distance = d;
            res.node = n;
          }
        }
      }

      return res;
    },
    {
      distance: Number.MAX_VALUE,
      node: null as Node | null
    }
  );
  if (!closestNode.node || !closestNode.node.positionAbsolute) {
    return null;
  }

  const closeNodeIsSource = closestNode.node.positionAbsolute.x < position.x;

  const closestNodePortDetails = getPortDetails(edges, closestNode.node);

  const edgeData = {
    source: closeNodeIsSource ? closestNode.node.id : (id ?? "new_node"),
    target: closeNodeIsSource ? (id ?? "new_node") : closestNode.node.id,
    sourceHandle: closeNodeIsSource ? closestNodePortDetails.freeOutputPorts[0] : nodePortDetails.freeOutputPorts[0],
    targetHandle: closeNodeIsSource ? nodePortDetails.freeInputPorts[0] : closestNodePortDetails.freeInputPorts[0]
  };
  if (!edgeData.sourceHandle || !edgeData.targetHandle) {
    return null;
  }
  return {
    id: `${edgeData.source}-${edgeData.sourceHandle}-${edgeData.target}-${edgeData.targetHandle}`,
    source: edgeData.source,
    target: edgeData.target,
    sourceHandle: edgeData.sourceHandle,
    targetHandle: edgeData.targetHandle
  };
};

export const getEdgeUnderMouse = (event: MouseEvent | DragEvent<HTMLDivElement>) => {
  const centerX = event.clientX;
  const centerY = event.clientY;
  const edge = document
    .elementsFromPoint(centerX, centerY)
    .find((el) => el.classList.contains("react-flow__edge-interaction"))?.parentElement;
  return edge;
};

export const getPortDetailsFromPropertiesData = (propertiesData: PropertiesData | null) =>
  propertiesData && propertiesData.inputs && propertiesData.outputs
    ? {
        hasUsedPorts: false,
        hasUsedInputPorts: false,
        hasUsedOutputPorts: false,
        hasFreeInputAndOutputPorts: propertiesData.inputs.length > 0 && propertiesData.outputs.length > 0,
        hasFreeInputPorts: propertiesData.inputs.length > 0,
        hasFreeOutputPorts: propertiesData.outputs.length > 0,
        outputConnections: propertiesData.outputs.length,
        inputConnections: propertiesData.inputs.length,
        inputPorts: propertiesData.inputs.map((name) => ({ name })),
        outputPorts: propertiesData.outputs.map((name) => ({ name })),
        freeInputPorts: propertiesData.inputs,
        freeOutputPorts: propertiesData.outputs
      }
    : null;

export const insideBounds = (
  event: React.DragEvent<HTMLDivElement>,
  reactFlowInstance: ReactFlowInstance | undefined,
  viewportContainerRef: React.RefObject<HTMLDivElement | null>
) => {
  const position = reactFlowInstance?.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY
  });
  const canvasBounds = viewportContainerRef.current?.getBoundingClientRect();
  const insideBounds =
    position &&
    canvasBounds &&
    event.clientX > canvasBounds.left &&
    event.clientX < canvasBounds.right &&
    event.clientY > canvasBounds.top &&
    event.clientY < canvasBounds.bottom;
  return insideBounds;
};

export const setDataTransferEffect = (
  event: React.DragEvent<HTMLDivElement>,
  dropEffect: DataTransfer["dropEffect"],
  effectAllowed: DataTransfer["effectAllowed"]
) => {
  event.dataTransfer.dropEffect = dropEffect;
  event.dataTransfer.effectAllowed = effectAllowed;
};

export const getCanvasPosition = (
  event: React.DragEvent<HTMLDivElement>,
  reactFlowInstance: ReactFlowInstance | undefined
) => {
  const canvasPosition = reactFlowInstance?.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY
  });
  return canvasPosition;
};

export const createGhostNode = (position: XYPosition, inputs: string[], outputs: string[]): Node => ({
  id: "new_node",
  position,
  type: "aiNode",
  data: {
    id: "new_node",
    name: "New Node",
    inputPorts: inputs.map((name) => ({ name })),
    outputPorts: outputs.map((name) => ({ name }))
  }
});

export const createGhostNodeForProximityEdge = (
  position: XYPosition,
  inputs: string[],
  outputs: string[],
  proximityEdge: Edge
): Node | null =>
  proximityEdge.source === "new_node" || proximityEdge.target === "new_node"
    ? createGhostNode(position, inputs, outputs)
    : null;

export const findEdge = (edges: Edge[], id: string | undefined) =>
  id !== undefined ? (edges.find((edge) => `edge-${edge.id}` === id) ?? null) : null;
