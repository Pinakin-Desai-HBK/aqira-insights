import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export const ShowLinesAction: ToolbarActionDefinition<"ShowLines"> = {
  icon: <ShowChartIcon sx={{ stroke: "yellow", fill: "yellow" }} />,
  name: "Show Lines",
  actionType: "ShowLines"
};
