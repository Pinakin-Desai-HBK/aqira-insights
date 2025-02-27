import { ToolbarActionDefinition } from "src/react/redux/types/ui/toolbar";
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff";

export const DisableTooltipsAction: ToolbarActionDefinition<"DisableTooltips"> = {
  icon: <SubtitlesOffIcon />,
  name: "Disable Tooltips",
  actionType: "DisableTooltips"
};
