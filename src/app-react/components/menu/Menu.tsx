import { MouseEvent, memo, useCallback } from "react";
import MuiMenu from "@mui/material/Menu";
import { MenuItem as MuiMenuItem, Tooltip } from "@mui/material";
import { MenuItem, MenuProps } from "src/redux/types/ui/menu";

export const Menu = memo(
  ({ id, prefix, items, dataTestId, positionProps, width, sxMenu, isCustomised, closeMenu, anchorEl }: MenuProps) => {
    const handleMenuItemClick = useCallback(
      (e: MouseEvent) => {
        const selectedType = e.currentTarget.getAttribute("data-type");
        closeMenu(e);
        if (selectedType) {
          const item = items.find((item) => {
            if (item.type === "Action") {
              const {
                action: {
                  params: { type }
                }
              } = item;
              return selectedType === type;
            }
            return false;
          });
          if (item && item.type === "Action") {
            const {
              action: { handler, params }
            } = item;
            handler(params);
          }
        }
        return false;
      },
      [closeMenu, items]
    );

    return (
      <MuiMenu
        className={isCustomised ? "AI-custom-menu" : "AI-common-menu"}
        sx={{
          "& .MuiPaper-root": {
            "& .menu-button-menu-item-label-inner": {
              display: "flex",
              alignItems: "center"
            },
            ...(width ? { width: `${width}px`, left: "10px" } : {})
          },
          ...sxMenu
        }}
        data-testid={`${dataTestId}-Menu`}
        id={`${prefix}-menu-${id}`}
        anchorEl={anchorEl}
        {...positionProps}
        open={anchorEl !== null}
        onClose={closeMenu}
        MenuListProps={{ "aria-labelledby": `${prefix}-button-${id}` }}
      >
        {items.map((props: MenuItem, index) => {
          switch (props.type) {
            case "Divider": {
              return (
                <li className="menu-button-menu-divider" key={`${prefix}-menu-${id}-divider-${index}`}>
                  <hr />
                </li>
              );
            }
            case "Label": {
              const { label } = props;
              return (
                <li className="menu-button-menu-label" key={`${prefix}-menu-${id}-${label.replaceAll(" ", "-")}`}>
                  {label}
                </li>
              );
            }
            case "Action": {
              const {
                action: {
                  params: { type, label, tooltip },
                  icon
                }
              } = props;
              return (
                <Tooltip
                  key={`${prefix}-menu-${id}-${type}`}
                  title={tooltip || ""}
                  placement="right"
                  disableInteractive
                >
                  <MuiMenuItem
                    className="menu-button-menu-item-label"
                    data-testid={`${dataTestId}-${type}`}
                    data-type={type}
                    onClick={handleMenuItemClick}
                  >
                    {icon ? (
                      <span className="menu-button-menu-item-label-inner">
                        {icon}&nbsp;{label}
                      </span>
                    ) : (
                      <span className="menu-button-menu-item-label-inner">{label}</span>
                    )}
                  </MuiMenuItem>
                </Tooltip>
              );
            }
          }
        })}
      </MuiMenu>
    );
  }
);
Menu.displayName = "Menu";
