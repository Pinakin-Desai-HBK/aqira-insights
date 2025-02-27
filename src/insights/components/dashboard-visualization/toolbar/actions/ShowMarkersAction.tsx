import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import CircleIcon from "@mui/icons-material/Circle";

export const ShowMarkersAction: ToolbarActionDefinition<"ShowMarkers"> = {
  icon: <CircleIcon />,
  name: "Show Markers",
  actionType: "ShowMarkers"
};
