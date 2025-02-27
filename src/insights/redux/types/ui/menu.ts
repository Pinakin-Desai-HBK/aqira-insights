import { PopoverOrigin, PopoverPosition, SxProps } from "@mui/material";
import { MouseEvent, ReactElement } from "react";
import { MenuAction } from "../actions";

export type MenuItem =
  | {
      type: "Action";
      action: MenuAction;
      tooltip?: string;
    }
  | {
      type: "Divider";
    }
  | {
      type: "Label";
      label: string;
    };

type MenuPositionProps = {
  anchorPosition?: PopoverPosition;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
};

type PassThroughMenuProps = {
  id: string;
  prefix: string;
  items: MenuItem[];
  dataTestId: string;
  positionProps?: MenuPositionProps | undefined;
  width?: number | undefined;
  sxMenu?: SxProps | undefined;
  isCustomised?: boolean | undefined;
};

export type MenuProps = PassThroughMenuProps & {
  closeMenu: (e: MouseEvent) => void;
  anchorEl: HTMLElement | null;
};

export type MenuButtonProps = PassThroughMenuProps & {
  openElement: ReactElement;
  closeElement?: ReactElement;
  altAnchorEl?: HTMLElement;
  sxButton?: SxProps;
  onOpen?: () => void;
  onClose?: () => void;
  tooltip?: string;
  tooltipOffset?: [number, number];
  disableRipple?: boolean;
  childOpen?: boolean;
  setChildOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
