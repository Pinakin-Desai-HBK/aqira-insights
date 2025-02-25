import { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import { maxZoom, minZoom } from "../hooks/useReactFlowConfig";

export const useRepositionView = () => {
  const { fitView, flowToScreenPosition, getZoom } = useReactFlow();

  const repositionView = useCallback(
    (nodes: Node[], viewportContainer: HTMLDivElement) => {
      const node = nodes[0];
      if (nodes.length !== 1) return;
      setTimeout(() => {
        if (!node || !node.width || !node.height) return;
        const nodeScreenPositionTopLeft = flowToScreenPosition(node.position);
        const nodeScreenPositionBottomRight = flowToScreenPosition({
          x: node.position.x + node.width,
          y: node.position.y + node.height
        });
        const viewportBounds = viewportContainer.getBoundingClientRect();
        const currentZoom = getZoom();
        const isNodefullyVIsible =
          nodeScreenPositionTopLeft.x >= viewportBounds.left &&
          nodeScreenPositionTopLeft.y >= viewportBounds.top &&
          nodeScreenPositionBottomRight.x <= viewportBounds.right &&
          nodeScreenPositionBottomRight.y <= viewportBounds.bottom;
        const nodeWidth = nodeScreenPositionBottomRight.x - nodeScreenPositionTopLeft.x;
        const nodeHeight = nodeScreenPositionBottomRight.y - nodeScreenPositionTopLeft.y;

        const willNodeFit = nodeWidth < viewportBounds.width && nodeHeight < viewportBounds.height;

        if (!isNodefullyVIsible)
          fitView({
            nodes: [{ id: node.id }],
            duration: 150,
            minZoom: willNodeFit ? currentZoom : minZoom,
            maxZoom: currentZoom ? currentZoom : maxZoom,
            padding: 0.1
          });
      }, 250);
    },
    [fitView, flowToScreenPosition, getZoom]
  );

  return repositionView;
};
