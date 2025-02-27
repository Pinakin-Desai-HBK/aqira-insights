import { MouseEvent, memo, useCallback, useState } from "react";
import Button from "@mui/material/Button";
import { MenuButtonProps } from "src/insights/redux/types/ui/menu";
import { Menu } from "./Menu";
import Tooltip from "@mui/material/Tooltip";
import useTheme from "@mui/material/styles/useTheme";

export const MenuButton = memo(
  ({
    id,
    prefix,
    items,
    openElement,
    closeElement,
    dataTestId,
    altAnchorEl,
    positionProps,
    width,
    sxMenu,
    sxButton,
    onOpen,
    onClose,
    isCustomised,
    tooltip,
    tooltipOffset,
    disableRipple,
    childOpen,
    setChildOpen
  }: MenuButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const openMenu = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (onOpen) onOpen();
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(altAnchorEl || e.currentTarget);
        return false;
      },
      [altAnchorEl, onOpen]
    );

    const closeMenu = useCallback(
      (e: MouseEvent) => {
        if (onClose) onClose();
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
        return false;
      },
      [onClose]
    );

    const additionalProps = tooltipOffset
      ? {
          slotProps: {
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: tooltipOffset
                  }
                }
              ]
            }
          }
        }
      : undefined;

    return (
      <div style={{ display: "flex", alignItems: "center", overflow: "hidden", borderRadius: "50%" }}>
        <Tooltip
          title={tooltip || null}
          placement="top"
          {...additionalProps}
          open={childOpen === true && !anchorEl}
          disableInteractive
        >
          <Button
            onMouseEnter={() => setChildOpen && setChildOpen(true)}
            onMouseLeave={() => setChildOpen && !anchorEl && setChildOpen(false)}
            id={`${prefix}-button-${id}`}
            data-testid={dataTestId}
            aria-controls={anchorEl ? `${prefix}-menu-${id}` : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? "true" : undefined}
            onClick={openMenu}
            disableRipple={disableRipple !== undefined ? disableRipple : false}
            sx={{
              width: "36px",
              minWidth: "36px",
              color: theme.palette.tab.buttonColor,
              "& .MuiTouchRipple-root": {
                width: "36px"
              },
              "&:hover": { backgroundColor: "transparent", color: theme.palette.tab.buttonColorHover },
              "&:focus": { outline: "none" },
              ...sxButton
            }}
          >
            {anchorEl && closeElement ? closeElement : openElement}
          </Button>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          positionProps={positionProps}
          width={width}
          sxMenu={sxMenu}
          dataTestId={dataTestId}
          prefix={prefix}
          id={id}
          items={items}
          closeMenu={closeMenu}
          isCustomised={isCustomised}
        />
      </div>
    );
  }
);
MenuButton.displayName = "MenuButton";
