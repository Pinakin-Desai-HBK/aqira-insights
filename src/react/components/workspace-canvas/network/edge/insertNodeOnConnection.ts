import { CreateEdgePayload, DeleteEdgePayload } from "src/react/redux/types/payload";
import { Workspace } from "src/react/redux/types/schemas/project";
import { NetworkEdgeDataUI } from "src/react/redux/types/ui/networkEdge";

export const insertNodeOnConnection = async ({
  freeInputPorts,
  freeOutputPorts,
  mutateCreateNetworkEdge,
  mutateDeleteNetworkEdge,
  edge,
  workspace,
  id
}: {
  freeInputPorts: string[];
  freeOutputPorts: string[];
  mutateCreateNetworkEdge: (params: { workspace: Workspace; edgeDetails: CreateEdgePayload }) => Promise<unknown>;
  mutateDeleteNetworkEdge: (params: { workspace: Workspace; edgeDetails: DeleteEdgePayload }) => Promise<unknown>;
  workspace: Workspace;
  edge: NetworkEdgeDataUI;
  id: string;
}) => {
  if (
    edge.sourceNode &&
    edge.destinationPort &&
    freeOutputPorts.length > 0 &&
    freeInputPorts[0] &&
    freeOutputPorts.length > 0 &&
    freeOutputPorts[0]
  ) {
    await mutateDeleteNetworkEdge({
      edgeDetails: {
        sourceNode: edge.sourceNode,
        destinationNode: edge.destinationNode,
        sourcePort: edge.sourcePort.name,
        destinationPort: edge.destinationPort.name
      },
      workspace
    });
    //const matchingDestinationPort = freeInputPorts.find((port) => port === edge.destinationPort.name);
    mutateCreateNetworkEdge({
      edgeDetails: {
        sourceNode: edge.sourceNode,
        destinationNode: id,
        sourcePort: edge.sourcePort.name,
        destinationPort: freeInputPorts[0] //matchingDestinationPort ? matchingDestinationPort : freeInputPorts[0]
      },
      workspace
    });
    //const matchingSourcePort = freeOutputPorts.find((port) => port === edge.sourcePort.name);
    mutateCreateNetworkEdge({
      edgeDetails: {
        sourceNode: id,
        destinationNode: edge.destinationNode,
        sourcePort: freeOutputPorts[0], //matchingSourcePort ? matchingSourcePort : freeOutputPorts[0],
        destinationPort: edge.destinationPort.name
      },
      workspace
    });
  }
};
