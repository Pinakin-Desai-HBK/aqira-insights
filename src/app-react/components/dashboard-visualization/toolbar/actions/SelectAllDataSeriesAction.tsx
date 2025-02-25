import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import CheckIcon from "@mui/icons-material/Check";

export const SelectAllDataSeriesAction: ToolbarActionDefinition<"SelectAllDataSeries"> = {
  icon: <CheckIcon />,
  name: "Select All Data Series",
  actionType: "SelectAllDataSeries"
};
