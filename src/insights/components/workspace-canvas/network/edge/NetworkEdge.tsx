import { BezierEdge, EdgeProps } from "reactflow";
import { NetworkEdgeDataUI } from "src/insights/redux/types/ui/networkEdge";
import { useRef } from "react";

const NetworkEdge = (props: EdgeProps<NetworkEdgeDataUI>) => {
  const { id, sourceX, sourceY, targetX, targetY, data } = props;
  const ref = useRef<SVGGElement | null>(null);
  if (!data) throw Error("No data provided for edge");
  return (
    <g id={`edge-${id}`} ref={ref}>
      <BezierEdge
        {...{
          ...props,
          sourceX,
          sourceY,
          targetX,
          targetY
        }}
      />
    </g>
  );
};

export default NetworkEdge;
