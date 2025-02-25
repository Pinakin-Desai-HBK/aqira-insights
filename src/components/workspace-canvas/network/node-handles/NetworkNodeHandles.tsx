import Tooltip from "@mui/material/Tooltip";
import { Handle, Position } from "reactflow";
import { NetworkNodeHandlesProps } from "src/redux/types/ui/networkNodes";

const NetworkNodeHandles = ({ nodeName, ports, position }: NetworkNodeHandlesProps) => {
  const radius = 38;
  const maxNumberOfHandles = 6;
  const shift = radius - 6;

  return ports
    .map((port, i) => {
      const length = i - (ports.length - 1) / 2;
      const theta = (length / maxNumberOfHandles) * Math.PI;

      return {
        name: port.name,
        style: {
          translate: `${position === Position.Left ? "-" : ""}${radius * Math.cos(theta)}px ${
            radius * Math.sin(theta)
          }px`,
          width: 11,
          height: 11,
          backgroundColor: "white",
          boxShadow: "inset 0px 0px 0px 2px black",
          border: "none",
          margin: "auto",
          left: `${position === Position.Left ? shift : ""}px`,
          right: `${position === Position.Right ? shift : ""}px`
        }
      };
    })
    .reverse()
    .map((config) => (
      <div
        key={config.name}
        data-testid={`AI-node-${position === Position.Left ? "input" : "output"}-${nodeName}-${config.name}`}
      >
        <Tooltip title={config.name} arrow placement={position === Position.Left ? "left" : "right"}>
          <Handle
            data-testid={`AI-node-${position === Position.Left ? "input" : "output"}-tooltip-${nodeName}-${
              config.name
            }`}
            type={position === Position.Left ? "target" : "source"}
            position={position}
            id={config.name}
            style={config.style}
          />
        </Tooltip>
      </div>
    ));
};

export default NetworkNodeHandles;
