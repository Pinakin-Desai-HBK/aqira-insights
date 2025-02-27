import { NetworkEdgeData } from "../schemas/networkNodes";
import { Workspace } from "../schemas/project";

export type NetworkEdgeDataUI = NetworkEdgeData & {
  workspace: Workspace;
};
