import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import InfoIcon from "@mui/icons-material/Info";

export const ControlSummaryAction: ToolbarActionDefinition<"ControlSummary"> = {
  icon: <InfoIcon />,
  name: "Control Summary",
  actionType: "ControlSummary"
};
