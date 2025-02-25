import Elk, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { type Direction, type LayoutAlgorithm } from ".";

const elk = new Elk();

function getDirection(direction: Direction) {
  switch (direction) {
    case "TB":
      return "DOWN";
    case "LR":
      return "RIGHT";
    case "BT":
      return "UP";
    case "RL":
      return "LEFT";
  }
}

const elkLayout: LayoutAlgorithm = async (nodes, edges, options) => {
  const graph: ElkNode = {
    id: "elk-root",
    layoutOptions: {
      "elk.algorithm": "mrtree",
      "elk.direction": getDirection(options.direction),
      "elk.spacing.nodeNode": `${options.spacing[0]}`
    },

    children: nodes.map((n) => {
      const targetPorts = n.data.inputPorts.map((t) => ({
        id: `${n.id}_${t.name}`,
        properties: {
          side: "WEST"
        }
      }));

      const sourcePorts = n.data.outputPorts.map((s) => ({
        id: `${n.id}_${s.name}`,
        properties: {
          side: "EAST"
        }
      }));

      return {
        id: n.id,
        width: n.width ?? 75,
        height: n.height ?? 75,
        properties: {
          "org.eclipse.elk.portConstraints": "FIXED_ORDER"
        },

        ports: [...targetPorts, ...sourcePorts]
      };
    }),
    edges: edges
      .map((e) => {
        if (!e.sourceHandle || !e.targetHandle) {
          return {
            id: e.id,
            sources: [],
            targets: []
          };
        }

        const source = `${e.source}_${e.sourceHandle}`;
        const target = `${e.target}_${e.targetHandle}`;

        return {
          id: e.id,
          sources: [source],
          targets: [target]
        };
      })
      .filter((e) => e !== undefined)
  };

  const root = await elk.layout(graph);
  const layoutNodes = new Map<string, ElkNode>();
  for (const node of root.children ?? []) {
    layoutNodes.set(node.id, node);
  }

  const nextNodes = nodes.map((node) => {
    const elkNode = layoutNodes.get(node.id)!;
    const position = { x: elkNode.x!, y: elkNode.y! };

    return {
      ...node,
      position
    };
  });

  return { nodes: nextNodes, edges };
};

export default elkLayout;
