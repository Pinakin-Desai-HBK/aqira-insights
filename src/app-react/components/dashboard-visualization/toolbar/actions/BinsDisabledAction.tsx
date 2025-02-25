import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import EqualizerIcon from "@mui/icons-material/Equalizer";

export const BinsDisabledAction: ToolbarActionDefinition<"BinsDisabled"> = {
  icon: <EqualizerIcon />,
  name: "Show Bins",
  actionType: "BinsDisabled"
};
