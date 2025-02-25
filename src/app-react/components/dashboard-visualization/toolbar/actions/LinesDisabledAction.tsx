import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export const LinesDisabledAction: ToolbarActionDefinition<"LinesDisabled"> = {
  icon: <ShowChartIcon />,
  name: "Show Lines",
  actionType: "LinesDisabled"
};
