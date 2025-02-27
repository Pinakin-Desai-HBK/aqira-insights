import { memo } from "react";
import { MenuButton } from "../menu/MenuButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useHeaderMenuItems from "./hooks/useHeaderMenuItems";
import { appLabels } from "src/insights/consts/labels";
import Tooltip from "@mui/material/Tooltip";

const labels = appLabels.HeaderMenu;

const HeaderMenu = memo(({ width }: { width: number }) => {
  const menuItems = useHeaderMenuItems();
  return (
    <MenuButton
      isCustomised={true}
      dataTestId="HeaderMenuButton"
      id="HeaderMenu"
      items={menuItems}
      prefix="header"
      width={width}
      positionProps={{
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
        transformOrigin: { horizontal: "right", vertical: "top" }
      }}
      sxButton={{
        borderRadius: "50%"
      }}
      sxMenu={{
        "& .MuiMenu-paper": {
          backgroundColor: "#00335A",
          color: "#FFF",
          padding: "8px",
          left: "10px !important",
          top: "40px !important",
          border: "1px solid #00C7F5",
          borderRadius: "5px",
          "& ul": {
            padding: "0px",
            "& li.menu-button-menu-label": {
              color: "#8FD6D4",
              fontSize: "14px",
              padding: "6px 16px"
            },
            "& li.menu-button-menu-item-label": {
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              },
              "& span": {
                color: "#FFF",
                fontSize: "12px"
              },
              "&:first-of-type span": {
                color: "#8FD6D4",
                fontSize: "16px"
              }
            },
            "& li.menu-button-menu-divider hr": {
              border: "none",
              height: "1px",
              color: "#174A84",
              backgroundColor: "#174A84"
            }
          }
        }
      }}
      openElement={
        <Tooltip title={labels.projectMenu} disableInteractive>
          <KeyboardArrowDownIcon sx={{ cursor: "pointer", color: "#00457B" }} />
        </Tooltip>
      }
    />
  );
});
HeaderMenu.displayName = "HeaderMenu";

export default HeaderMenu;
