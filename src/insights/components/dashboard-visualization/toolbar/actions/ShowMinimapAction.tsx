import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import LayersIcon from "@mui/icons-material/Layers";

export const ShowMinimapAction: ToolbarActionDefinition<"ShowMinimap"> = {
  icon: <LayersIcon />,
  name: "Show Minimap",
  actionType: "ShowMinimap"
};
