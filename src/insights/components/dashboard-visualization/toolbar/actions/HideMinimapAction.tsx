import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import LayersClearIcon from "@mui/icons-material/LayersClear";

export const HideMinimapAction: ToolbarActionDefinition<"HideMinimap"> = {
  icon: <LayersClearIcon />,
  name: "Hide Minimap",
  actionType: "HideMinimap"
};
