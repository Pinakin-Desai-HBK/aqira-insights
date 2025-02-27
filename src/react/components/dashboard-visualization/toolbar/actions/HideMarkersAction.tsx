import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import HideSourceIcon from "@mui/icons-material/HideSource";

export const HideMarkersAction: ToolbarActionDefinition<"HideMarkers"> = {
  icon: <HideSourceIcon />,
  name: "Hide Markers",
  actionType: "HideMarkers"
};
