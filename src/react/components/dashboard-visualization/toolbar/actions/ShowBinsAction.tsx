import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import EqualizerIcon from "@mui/icons-material/Equalizer";

export const ShowBinsAction: ToolbarActionDefinition<"ShowBins"> = {
  icon: <EqualizerIcon sx={{ stroke: "yellow", fill: "yellow" }} />,
  name: "Show Bins",
  actionType: "ShowBins"
};
