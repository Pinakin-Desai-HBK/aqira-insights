import { type Node, type Edge } from "reactflow";

import dagre from "./dagre";
import d3Hierarchy from "./d3-hierarchy";
import elk from "./elk";
import { NetworkNodeDataUI } from "src/redux/types/ui/networkNodes";

export type Direction = "TB" | "LR" | "RL" | "BT";

export type LayoutAlgorithmOptions = {
  direction: Direction;
  spacing: [number, number];
};

export type LayoutAlgorithm = (
  nodes: Node<NetworkNodeDataUI>[],
  edges: Edge[],
  options: LayoutAlgorithmOptions
) => Promise<{ nodes: Node<NetworkNodeDataUI>[]; edges: Edge[] }>;

export default {
  dagre,
  "d3-hierarchy": d3Hierarchy,
  elk
};
