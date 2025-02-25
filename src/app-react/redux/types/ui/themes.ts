import { createTheme } from "@mui/material";
import { gridClasses } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";

type Properties = {
  text: string;
  group: string;
  switchOff: string;
  switchOn: string;
  input: string;
  border: string;
} & GroupToggle;

export type ThemeSearch = { background: string; border: string; icon: string };

type SideBar = {
  background: string;
  selectedIcon: string;
  selectedHover: string;
  separator: string;
  unselectedIcon: string;
  unselectedHover: string;
  toggle: string;
  toggleHover: string;
};

type Canvas = { background: string; resizerBackground: string };

type PanelData = { background: string };

type PanelLog = { background: string };

type DataPanel = {
  background: string;
  itemsBackground: string;
  hoverBackground: string;
};

export type GroupToggle = {
  groupToggle: string;
  groupToggleHover: string;
};

type PanelPalette = {
  background: string;
  itemsBackground: string;
  hoverBackground: string;
} & GroupToggle;

type FileBrowser = { border: string; hoverBorder: string };

type TableVisComp = { headerBackground: string };

type Tab = {
  buttonColor: string;
  buttonColorHover: string;
};

export type LandingPageItemTheme = {
  border: string;
  background: string;
  text: string;
  hover: {
    border: string;
    background: string;
  };
};

type LandingPage = {
  subText: string;
  network: LandingPageItemTheme;
  dashboard: LandingPageItemTheme;
};

type Toolbar = {
  border: string;
  background: string;
  color: string;
  hover: string;
};

type Feedback = {
  titleText: string;
  subtitleText: string;
  categoryButtonBackgroundSelected: string;
  categoryButtonBackgroundUnselected: string;
  categoryButtonTextSelected: string;
  categoryButtonTextUnselected: string;
  ratingIconButtonHover: string;
  unavailableImageLabel: string;
};

declare module "@mui/material/styles" {
  interface Palette {
    fileBrowser: FileBrowser;
    panelLog: PanelLog;
    panelData: PanelData;
    panelDataExplorer: DataPanel;
    panelNodePalette: PanelPalette;
    panelVisualizationPalette: PanelPalette;
    properties: Properties;
    searchPalette: ThemeSearch;
    searchDataExplorer: ThemeSearch;
    sidebar: SideBar;
    canvas: Canvas;
    tableVisComp: TableVisComp;
    landingPage: LandingPage;
    toolbar: Toolbar;
    tab: Tab;
    feedback: Feedback;
  }
  interface PaletteOptions {
    fileBrowser: Partial<FileBrowser>;
    panelLog: Partial<PanelLog>;
    panelData: Partial<PanelData>;
    panelDataExplorer: Partial<DataPanel>;
    panelNodePalette: Partial<PanelPalette>;
    panelVisualizationPalette: PanelPalette;
    properties: Partial<Properties>;
    searchPalette: Partial<ThemeSearch>;
    searchDataExplorer: Partial<ThemeSearch>;
    sidebar: Partial<SideBar>;
    canvas: Partial<Canvas>;
    tableVisComp: Partial<TableVisComp>;
    landingPage: Partial<LandingPage>;
    toolbar: Partial<Toolbar>;
    tab: Partial<Tab>;
    feedback: Partial<Feedback>;
  }
}

const MenuItemRoot = {
  padding: "0px 10px",
  fontSize: "12px",
  fontWeight: "normal",
  height: "24px",
  "& .MuiSvgIcon-root": {
    paddingRight: "5px",
    width: "20px"
  },
  "& img": {
    paddingRight: "5px",
    width: "20px"
  },
  "& .MuiTypography-root": {
    fontSize: "12px",
    fontWeight: "normal",
    height: "24px",
    display: "flex",
    alignItems: "center"
  }
};
// If you change a color here make sure any other instances of that color here are changed too
export const themeAILight = createTheme({
  mixins: {
    MuiDataGrid: {
      containerBackground: "#FFF"
    }
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        root: {
          "&.AI-common-menu .MuiPaper-root": {
            "& .MuiMenu-list": {
              padding: "5px 0px"
            },
            "& .MuiMenuItem-root ": MenuItemRoot
          }
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        menu: {
          "&.MuiDataGrid-menu .MuiPaper-root": {
            "& .MuiList-root": {
              minWidth: "unset"
            },
            "& .MuiListItemIcon-root": {
              minWidth: "unset",
              marginRight: "5px"
            },
            "& .MuiMenu-list": {
              padding: "5px 0px"
            },
            "& .MuiMenuItem-root ": MenuItemRoot
          }
        },
        root: {
          borderColor: "transparent",
          "--unstable_DataGrid-overlayBackground": "#EEE",
          "--DataGrid-rowBorderColor": "none",
          "& .MuiDataGrid-main": {
            backgroundColor: "#EEE"
          },
          "& .MuiDataGrid-cell": {
            padding: "5px 10px 3px 10px"
          },
          "& .odd": { backgroundColor: "#FFF" },
          "& .even": { backgroundColor: "#F8F8FA" },
          "& .MuiDataGrid-scrollbar--horizontal": { left: "0px" },
          "& .MuiDataGrid-footerContainer": { minHeight: "30px", height: "30px", backgroundColor: "#FFF" },
          "& .MuiDataGrid-virtualScroller > .MuiDataGrid-filler": { backgroundColor: "#EEE" },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#DDD"
          },
          "& .MuiDataGrid-menuIconButton": {
            width: "10px",
            paddingRight: "10px",
            ":hover": {
              backgroundColor: "#FFF"
            }
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: "none"
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
            outline: "none"
          },
          "& .MuiTablePagination-root": {
            overflow: "hidden"
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {}
    }
  },
  palette: {
    mode: "light",
    primary: { main: "#025f7e", light: "#025f7e" },
    secondary: { main: "#fff" },
    background: { default: "#eef5fb" },
    error: { main: "#F00", light: "#F00" },
    text: { primary: "#00457B", secondary: "#FFFFFF" },
    fileBrowser: { border: "rgba(224, 224, 224, 1)", hoverBorder: "#00335A" },
    panelLog: { background: "#DEF" },
    panelData: { background: "#5abebf" },
    panelNodePalette: {
      background: "#025f7e",
      itemsBackground: "#02567C",
      hoverBackground: "#177695",
      groupToggle: "#33B6B1",
      groupToggleHover: "#5adbd6"
    },
    panelVisualizationPalette: {
      background: "#025f7e",
      itemsBackground: "#02567C",
      hoverBackground: "#177695",
      groupToggle: "#33B6B1",
      groupToggleHover: "#5adbd6"
    },
    panelDataExplorer: {
      background: "#237F7B",
      itemsBackground: "#1d7978",
      hoverBackground: "#177695"
    },
    searchPalette: { background: "#02567C", border: "#73B2E3", icon: "#73B2E3" },
    searchDataExplorer: { background: "#1d7978", border: "rgba(255, 255, 255, 0.5)", icon: "#FFFFFF" },
    sidebar: {
      background: "#00335A",
      selectedIcon: "#FFF",
      selectedHover: "#DDD",
      separator: "#2EA39F",
      unselectedIcon: "#2EA39F",
      unselectedHover: "#52c5c1",
      toggle: "#FFF",
      toggleHover: "#DDD"
    },
    tab: { buttonColor: "#33B6B1", buttonColorHover: "#5adbd6" },
    properties: {
      text: "#47505C",
      group: "#F8F8FA",
      switchOff: "#D6D8DD",
      switchOn: "#2678B8",
      input: "#FFFFFF",
      border: "#D6D8DD",
      groupToggle: "#47505C",
      groupToggleHover: "#47505C"
    },
    landingPage: {
      subText: "#00457B",
      network: {
        border: "#73B2E3",
        background: "#73B2E31A",
        text: "#73B2E3",
        hover: {
          border: "#00335A",
          background: "#73B2E333"
        }
      },
      dashboard: {
        border: "#8FD6D4",
        background: "#8FD6D41A",
        text: "#8FD6D4",
        hover: {
          border: "#025F7E",
          background: "#8FD6D433"
        }
      }
    },
    canvas: {
      background: "#E6F4FF",
      resizerBackground: "#7f7fbf"
    },
    tableVisComp: { headerBackground: "#00457b" },
    toolbar: {
      border: "rgb(189, 189, 189)",
      background: "#00335A",
      color: "#FFFFFF",
      hover: "#DDD"
    },
    feedback: {
      titleText: "#00607E",
      subtitleText: "#757575",
      categoryButtonBackgroundSelected: "#12578C",
      categoryButtonBackgroundUnselected: "#EFEFEF",
      categoryButtonTextSelected: "#FFF",
      categoryButtonTextUnselected: "#757575",
      ratingIconButtonHover: "rgba(0, 0, 0, 0.1)",
      unavailableImageLabel: "#667085"
    }
  },
  typography: {
    fontWeightRegular: 500,
    fontWeightBold: 800,
    button: {
      textTransform: "none"
    }
  }
});
