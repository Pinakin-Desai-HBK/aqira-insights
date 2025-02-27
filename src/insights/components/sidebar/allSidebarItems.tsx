import DataExplorer from "../data-explorer/DataExplorer";
import Palette from "../palette/Palette";
import { AboutIcon, DataIcon, FeedbackIcon, HelpIcon, LogIcon, NodesIcon, VisualizationsIcon } from "../icon/Icon";
import { SideBarItem } from "src/insights/redux/types/ui/palette";

export const allSidebarItems: SideBarItem[] = [
  {
    type: "palettePanelItem",
    id: 1,
    selected: false,
    icon: DataIcon,
    component: <DataExplorer />,
    idName: "data",
    label: "Data"
  },
  {
    type: "palettePanelItem",
    id: 2,
    selected: false,
    icon: NodesIcon,
    component: <Palette type={"NodeContent"} />,
    idName: "nodes",
    label: "Nodes"
  },
  {
    type: "palettePanelItem",
    id: 3,
    selected: false,
    icon: VisualizationsIcon,
    component: <Palette type={"VisualizationContent"} />,
    idName: "visualizations",
    label: "Visualizations"
  },
  {
    type: "separatorItem",
    includeInPopout: false,
    id: 4,
    idName: "separator1"
  },
  {
    type: "uiPanelItem",
    id: 5,
    icon: LogIcon,
    idName: "log",
    selected: false,
    label: "Log Panel",
    includeInPopout: false
  },
  {
    type: "separatorItem",
    includeInPopout: false,
    id: 6,
    idName: "separator2"
  },
  {
    type: "uiPanelEventlessItem",
    id: 7,
    icon: AboutIcon,
    idName: "about",
    selected: false,
    includeInPopout: false,
    label: "About"
  },
  {
    type: "uiPanelEventlessItem",
    id: 8,
    icon: HelpIcon,
    idName: "help",
    selected: false,
    includeInPopout: false,
    label: "Help"
  },
  {
    type: "uiPanelItem",
    id: 9,
    icon: FeedbackIcon,
    idName: "feedback",
    selected: false,
    includeInPopout: false,
    label: "Feedback"
  }
];
