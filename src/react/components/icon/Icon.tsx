import { CSSProperties } from "react";
import NetworkIconSvg from "./tab-icon-network.svg";
import VisualizationsPaletteIcon from "./palette-icon-visualiations.svg";
import CategoryIcon from "@mui/icons-material/Category";
import SidebarAboutIcon from "./sidebar-icon-about.svg";
import ListAltIcon from "@mui/icons-material/ListAlt";
import styles from "./Icon.module.css";
import PythonIconSvg from "./python.svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconProps, TooltipIconProps } from "src/react/redux/types/ui/icon";
import SidebarFeedbackIcon from "./sidebar-icon-feedback.svg";
import Tooltip from "@mui/material/Tooltip";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";

export const Icon = ({ src, style, alt, title, inverted = true }: IconProps) => (
  <img src={src} title={title} alt={alt} style={{ ...(inverted ? { filter: "invert(1)" } : {}), ...style }} />
);

export const NetworkIcon = (style: CSSProperties) => <Icon src={NetworkIconSvg} style={style} inverted={false} />;
export const NetworkIconInverted = (style: CSSProperties) => (
  <Icon src={NetworkIconSvg} style={style} inverted={true} />
);

export const DashboardIcon = (style: CSSProperties) => (
  <Icon src={VisualizationsPaletteIcon} style={style} inverted={false} />
);
export const DashboardIconInverted = (style: CSSProperties) => (
  <Icon src={VisualizationsPaletteIcon} style={style} inverted={true} />
);

export const PythonIcon = (style: CSSProperties) => <Icon src={PythonIconSvg} style={style} inverted={false} />;

export const TooltipIcon = ({ title, tooltipPlacement, classes, children }: TooltipIconProps) => (
  <Tooltip title={title} placement={tooltipPlacement || "right"} disableInteractive>
    <span className={`${styles.icon} ${classes}`}>{children}</span>
  </Tooltip>
);

export const NodesIcon = (
  <TooltipIcon title="Nodes" tooltipPlacement="right" classes={styles.nodes_icon}>
    <CategoryIcon />
  </TooltipIcon>
);

export const VisualizationsIcon = (
  <TooltipIcon title="Visualizations" tooltipPlacement="right" classes={styles.visualizations_icon}>
    <CategoryIcon />
  </TooltipIcon>
);

export const LogIcon = (
  <TooltipIcon title="Log Panel" tooltipPlacement={"right"}>
    <ListAltIcon />
  </TooltipIcon>
);

export const AboutIcon = (
  <TooltipIcon title="About" tooltipPlacement={"right"}>
    <Icon src={SidebarAboutIcon} style={{}} inverted={true} />
  </TooltipIcon>
);

export const DataIcon = (
  <Tooltip title="Data" placement="right" disableInteractive>
    <InsertDriveFile />
  </Tooltip>
);

export const HelpIcon = (
  <Tooltip title="Help" placement="right" disableInteractive>
    <HelpOutlineIcon />
  </Tooltip>
);

export const FeedbackIcon = (
  <TooltipIcon title="Feedback" tooltipPlacement={"right"}>
    <Icon src={SidebarFeedbackIcon} style={{}} inverted={false} />
  </TooltipIcon>
);
