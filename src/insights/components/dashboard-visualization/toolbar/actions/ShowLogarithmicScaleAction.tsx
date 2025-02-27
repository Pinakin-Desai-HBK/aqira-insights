import { ToolbarActionDefinition } from "../../../../redux/types/ui/toolbar";
import SvgIcon from "@mui/material/SvgIcon";

export const ShowLogarithmicScaleAction: ToolbarActionDefinition<"ShowLogarithmicScale"> = {
  icon: (
    <SvgIcon>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="30%" y1="95%" x2="70%" y2="95%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="85%" x2="70%" y2="85%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="70%" x2="70%" y2="70%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="50%" x2="70%" y2="50%" strokeWidth="1" stroke="white" />
        <line x1="30%" y1="20%" x2="70%" y2="20%" strokeWidth="1" stroke="white" />
        <line x1="70%" y1="0%" x2="70%" y2="100%" strokeWidth="3" stroke="white" />
      </svg>
    </SvgIcon>
  ),
  name: "Show Logarithmic Scale",
  actionType: "ShowLogarithmicScale"
};
