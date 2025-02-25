import { createContext } from "react";
import {
  NodeToolbarContextType,
  ToolbarContextData,
  ToolbarTargetActionsKeys
} from "../../../../redux/types/ui/toolbar";

export const NodeToolbarContext: NodeToolbarContextType = createContext<ToolbarContextData<ToolbarTargetActionsKeys>>(
  null!
);
