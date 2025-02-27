import { CSSProperties } from "react";
import {
  DashboardIcon,
  DashboardIconInverted,
  NetworkIcon,
  NetworkIconInverted
} from "src/insights/components/icon/Icon";

const TabIconStyle: CSSProperties = { width: "24px", height: "24px", padding: "2px", marginRight: "5px" };

export const getTabIcon = ({ type, selected }: { type: "Network" | "Dashboard"; selected: boolean }) =>
  selected
    ? type === "Network"
      ? NetworkIconInverted(TabIconStyle)
      : DashboardIconInverted(TabIconStyle)
    : type === "Network"
      ? NetworkIcon(TabIconStyle)
      : DashboardIcon(TabIconStyle);
