import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import SvgIcon from "@mui/material/SvgIcon";

export const ShowLinearScaleAction: ToolbarActionDefinition<"ShowLinearScale"> = {
  icon: (
    <SvgIcon>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="30%" y1="95%" x2="70%" y2="95%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="75%" x2="70%" y2="75%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="55%" x2="70%" y2="55%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="35%" x2="70%" y2="35%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="15%" x2="70%" y2="15%" strokeWidth="1" stroke="white" />
        <line x1="70%" y1="0%" x2="70%" y2="100%" strokeWidth="3" stroke="white" />
      </svg>
    </SvgIcon>
  ),
  name: "Show Linear Scale",
  actionType: "ShowLinearScale"
};
