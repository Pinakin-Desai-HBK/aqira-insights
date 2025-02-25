import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

export const ResetZoomAction: ToolbarActionDefinition<"ResetZoom"> = {
  icon: <ZoomOutMapIcon />,
  name: "Reset Zoom",
  actionType: "ResetZoom"
};
