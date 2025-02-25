import { Position as ReactflowPosition } from "reactflow";
import { CreateNodePayload } from "../payload";
import { NetworkNodeDataApi } from "../schemas/networkNodes";
import { WorkspaceItemIdentifier } from "../redux/networkNodes";

export type NetworkNodeDataUI = NetworkNodeDataApi & { identifier: WorkspaceItemIdentifier };

export type CreateNodeParams = {
  payload: CreateNodePayload;
  callback?: ((node: NetworkNodeDataUI) => void) | undefined;
};

export type Position = {
  x: number;
  y: number;
};

type PortData = {
  name: string;
};

export type NetworkNodeHandlesProps = {
  nodeName: string;
  ports: PortData[];
  position: ReactflowPosition;
};
