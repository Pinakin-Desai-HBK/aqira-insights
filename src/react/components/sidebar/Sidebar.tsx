import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { InitallySelectableSideBarItemIdName, PalettePanelSideBarItem } from "src/react/redux/types/ui/palette";
import { useSidebarItems } from "./hooks/useSidebarItems";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";

const barWidth = 56;
const barWidthExpanded = 150;
const barPadding = 12;
const iconLength = 24;
const spaceBetweenIcons = 32;
const indicatorWidth = 2;

const Sidebar = ({
  initialSelectedPaletteItems,
  setSelectedPaletteItems
}: {
  initialSelectedPaletteItems: InitallySelectableSideBarItemIdName[];
  setSelectedPaletteItems: Dispatch<SetStateAction<PalettePanelSideBarItem[]>>;
}) => {
  const theme = useTheme();
  const { filteredItems, paletteItems, handleSidebarItemClick } = useSidebarItems(initialSelectedPaletteItems);
  useEffect(() => setSelectedPaletteItems(paletteItems), [paletteItems, setSelectedPaletteItems]);
  const [expanded, setExpanded] = useState(localStorage.getItem("sidebar-state") === "expanded");
  const toggleExpanded = useCallback(() => {
    const newExpandedValue = !expanded;
    localStorage.setItem("sidebar-state", newExpandedValue ? "expanded" : "collapsed");
    setExpanded(newExpandedValue);
  }, [expanded]);
  return (
    <Box
      borderRadius={1}
      marginRight={"5px"}
      sx={{
        background: theme.palette.sidebar.background,
        width: expanded ? barWidthExpanded : barWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      data-testid="AI-sidebar"
    >
      <List
        sx={{
          flexGrow: 1,
          flex: 1,
          flexDirection: "column",
          display: "flex",
          padding: `${barPadding}px`,
          overflowX: "visible",
          alignItems: "center"
        }}
      >
        {filteredItems.map((item, index) => {
          return item.type === "separatorItem" ? (
            <ListItem
              disablePadding
              key={item.id}
              sx={{ flexGrow: 1, alignItems: "end", marginBottom: `${barPadding}px` }}
            >
              <hr
                style={{
                  width: "100%",
                  border: "none",
                  height: "0.1px",
                  backgroundColor: theme.palette.sidebar.separator,
                  marginBlockEnd: "0px"
                }}
              />
            </ListItem>
          ) : (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                height: `${iconLength}px`,
                width: expanded ? `${barWidthExpanded - 6}px` : `${barWidth - 6}px`,
                marginBottom: index === filteredItems.length - 1 ? "0px" : `${spaceBetweenIcons}px`,
                padding: "0px",
                borderLeft: `${indicatorWidth}px solid transparent`,
                borderRight: `${indicatorWidth}px solid ${
                  item.selected ? theme.palette.sidebar.selectedIcon : "transparent"
                }`,
                flexDirection: "column",
                "&:hover": {
                  ".MuiListItemText-root": {
                    color: item.selected ? theme.palette.sidebar.selectedHover : theme.palette.sidebar.unselectedHover
                  },
                  ".MuiListItemIcon-root": {
                    color: item.selected ? theme.palette.sidebar.selectedHover : theme.palette.sidebar.unselectedHover,
                    fill: item.selected ? theme.palette.sidebar.selectedHover : theme.palette.sidebar.unselectedHover
                  }
                }
              }}
              onClick={() => handleSidebarItemClick(item)}
            >
              <ListItemButton
                data-name={`${item.idName}`}
                data-testid={`AI-sidebar-button-${item.idName}`}
                sx={{ padding: "0px", display: "flex", flexDirection: "column", width: "100%" }}
              >
                <>
                  <ListItemIcon
                    sx={{
                      color: item.selected ? "text.secondary" : theme.palette.sidebar.unselectedIcon,
                      fill: item.selected ? theme.palette.sidebar.selectedIcon : theme.palette.sidebar.unselectedIcon,

                      minWidth: `${iconLength}px`,
                      width: `${iconLength}px`,
                      minHeight: `${iconLength}px`,
                      height: `${iconLength}px`
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    data-testid={`AI-sidebar-button-${item.idName}-label`}
                    sx={{
                      display: expanded ? "block" : "none",
                      color: item.selected ? "text.secondary" : theme.palette.sidebar.unselectedIcon
                    }}
                  />
                </>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Tooltip title={expanded ? "Collapse" : "Expand"} placement="right" disableInteractive>
        <IconButton
          sx={{ flexGrow: 0, flex: 0, height: "40px", alignSelf: "end" }}
          onClick={toggleExpanded}
          data-testid={`AI-sidebar-toggle-${expanded ? "collapse" : "expand"}`}
        >
          {expanded ? (
            <KeyboardDoubleArrowLeftIcon
              sx={{ color: theme.palette.sidebar.toggle, "&:hover": { color: theme.palette.sidebar.toggleHover } }}
            />
          ) : (
            <KeyboardDoubleArrowRightIcon
              sx={{ color: theme.palette.sidebar.toggle, "&:hover": { color: theme.palette.sidebar.toggleHover } }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Sidebar;
