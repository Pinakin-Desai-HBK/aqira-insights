import { describe, expect, it } from "vitest";
import { mapNodes, mapVisualizations } from "src/react/redux/api/utils/mappers";

const nodes = [
  { type: "TestNode1", name: "TestNode1_1", icon: "TestNode1_Icon", description: "TestNode1 Description" },
  { type: "TestNode2", name: "TestNode2_1", icon: "TestNode2_Icon", description: "TestNode2 Description" }
];
const nodesGroup = "NodesGroup 1";

const visualizations = [
  { type: "TestVis1", name: "TestVis1_1", icon: "TestVis1_Icon", description: "TestVis1 Description" },
  { type: "TestVis2", name: "TestVis2_1", icon: "TestVis2_Icon", description: "TestVis2 Description" }
];
const visGroup = "VisGroup 1";

describe("appDataContextUtils", () => {
  describe("mapNodes", () => {
    it("should map nodes to UIPaletteGroupData", () => {
      const result = mapNodes({ nodes, group: nodesGroup });

      expect(result.groupName).toBe(nodesGroup);
      expect(result.items).toEqual(nodes);
    });
  });

  describe("mapVisualizations", () => {
    it("should map visualizations to UIPaletteGroupData", () => {
      const result = mapVisualizations({ visualizations, group: visGroup });

      expect(result.groupName).toBe(visGroup);
      expect(result.items).toEqual(visualizations);
    });
  });
});
