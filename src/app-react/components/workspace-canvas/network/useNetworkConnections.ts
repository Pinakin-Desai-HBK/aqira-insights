import { useCallback, useEffect, useState } from "react";
import {
  ReactFlowInstance,
  EdgeChange,
  Edge as ReactFlowEdge,
  Connection as ReactFlowConnection,
  applyEdgeChanges,
  addEdge
} from "reactflow";
import { Workspace } from "src/redux/types/schemas/project";
import {
  useCreateNetworkConnectionMutation,
  useDeleteNetworkConnectionMutation,
  useGetNetworkConnectionsQuery
} from "src/redux/api/appApi";
import { NetworkEdgeData } from "src/redux/types/schemas/networkNodes";
import { NetworkEdgeDataUI } from "src/redux/types/ui/networkEdge";

const CreateEdgeFromApi = (edgeData: NetworkEdgeData, workspace: Workspace): ReactFlowEdge<NetworkEdgeDataUI> => ({
  id: `${edgeData.sourceNode}-${edgeData.sourcePort.name}-${edgeData.destinationNode}-${edgeData.destinationPort.name}`,
  source: edgeData.sourceNode,
  target: edgeData.destinationNode,
  sourceHandle: edgeData.sourcePort.name,
  targetHandle: edgeData.destinationPort.name,
  data: { ...edgeData, workspace },
  type: "aiEdge"
});

const useNetworkConnections = (reactFlowInstance: ReactFlowInstance | null, workspace: Workspace) => {
  const [mutateCreateNetworkEdge] = useCreateNetworkConnectionMutation();
  const [mutateDeleteNetworkEdge] = useDeleteNetworkConnectionMutation();
  const { data: edgesData } = useGetNetworkConnectionsQuery({ workspace });
  const [edges, setEdges] = useState<ReactFlowEdge<NetworkEdgeData>[]>([]);

  useEffect(() => {
    if (edgesData) {
      setEdges(edgesData.map((currentEdge) => CreateEdgeFromApi(currentEdge, workspace)));
    }
  }, [edgesData, workspace]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((ns) => applyEdgeChanges(changes, ns)),
    [setEdges]
  );

  const onEdgesDelete = useCallback(
    (edges: ReactFlowEdge[]) => {
      edges.forEach((edge) => {
        const { source, target, sourceHandle, targetHandle, selected } = edge;
        if (source && target && sourceHandle && targetHandle && selected)
          mutateDeleteNetworkEdge({
            edgeDetails: {
              sourceNode: source,
              destinationNode: target,
              sourcePort: sourceHandle,
              destinationPort: targetHandle
            },
            workspace
          });
      });
    },
    [mutateDeleteNetworkEdge, workspace]
  );

  const onEdgeConnect = useCallback(
    async (edge: ReactFlowConnection) => {
      if (typeof reactFlowInstance === "undefined") return;
      const { source, target, sourceHandle, targetHandle } = edge;
      if (source && target && sourceHandle && targetHandle) {
        if (source !== target) {
          const result = await mutateCreateNetworkEdge({
            workspace,
            edgeDetails: {
              sourceNode: source,
              destinationNode: target,
              sourcePort: sourceHandle,
              destinationPort: targetHandle
            }
          });
          const { error } = result;
          if (!error) {
            setEdges((eds) => addEdge(edge, eds));
          }
        }
      }
    },
    [reactFlowInstance, mutateCreateNetworkEdge, workspace]
  );

  return {
    edges,
    onEdgesDelete,
    onEdgeConnect,
    onEdgesChange
  };
};

export default useNetworkConnections;
