import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import ClearIcon from "@mui/icons-material/Clear";

export const DeselectAllDataSeriesAction: ToolbarActionDefinition<"DeselectAllDataSeries"> = {
  icon: <ClearIcon />,
  name: "Deselect All Data Series",
  actionType: "DeselectAllDataSeries"
};
