import { MiniMap } from "reactflow";
import { PaletteData } from "src/react/redux/types/ui/palette";

const minimapStyle = {
  height: 120
};

const CanvasMiniMap = ({
  nodeBorderRadius,
  zoomStep,
  paletteData,
  label
}: {
  nodeBorderRadius: 50 | 0;
  zoomStep: 10 | 0.5;
  label: "Network Overview" | "Dashboard Overview";
  paletteData: PaletteData | undefined;
}) => {
  return (
    <MiniMap
      style={minimapStyle}
      ariaLabel={label}
      zoomable
      zoomStep={zoomStep}
      pannable
      nodeBorderRadius={nodeBorderRadius}
      position="bottom-right"
      nodeStrokeColor="#000000"
      nodeColor={(node) => {
        const paletteItem = paletteData!.itemsMap[node.data.type];
        return paletteItem ? paletteItem.color : "#FF0000";
      }}
    />
  );
};

export default CanvasMiniMap;
