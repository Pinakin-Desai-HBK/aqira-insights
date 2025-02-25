import { ToolbarActionDefinition } from "src/redux/types/ui/toolbar";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

export const EnableTooltipsAction: ToolbarActionDefinition<"EnableTooltips"> = {
  icon: <SubtitlesIcon />,
  name: "Enable Tooltips",
  actionType: "EnableTooltips"
};
