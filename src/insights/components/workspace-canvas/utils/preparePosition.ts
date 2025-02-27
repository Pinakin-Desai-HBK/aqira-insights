import { Position } from "src/insights/redux/types/ui/networkNodes";

export const preparePosition = (position: Position) => ({
  x: Math.floor(position.x),
  y: Math.floor(position.y)
});
