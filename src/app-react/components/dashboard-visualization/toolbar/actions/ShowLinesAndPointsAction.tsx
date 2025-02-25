import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import TimelineIcon from "@mui/icons-material/Timeline";

export const ShowLinesAndPointsAction: ToolbarActionDefinition<"ShowLinesAndPoints"> = {
  icon: <TimelineIcon sx={{ stroke: "yellow", fill: "yellow" }} />,
  name: "Show Lines and Points",
  actionType: "ShowLinesAndPoints"
};
