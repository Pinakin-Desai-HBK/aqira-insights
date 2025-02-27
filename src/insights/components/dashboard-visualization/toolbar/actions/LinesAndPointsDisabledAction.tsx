import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import TimelineIcon from "@mui/icons-material/Timeline";

export const LinesAndPointsDisabledAction: ToolbarActionDefinition<"LinesAndPointsDisabled"> = {
  icon: <TimelineIcon />,
  name: "Show Line and Points",
  actionType: "LinesAndPointsDisabled"
};
