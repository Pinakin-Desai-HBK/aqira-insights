import Fab, { FabOwnProps } from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";

export const ControlsFab = ({
  onClick,
  testId,
  title,
  sx,
  children,
  color = "primary"
}: {
  onClick: () => void;
  testId: string;
  title: string;
  children: React.ReactNode;
  sx?: FabOwnProps["sx"];
  color?: FabOwnProps["color"];
}) => (
  <Tooltip title={title} disableInteractive>
    <Fab
      sx={{ flexShrink: 0, ...sx }}
      data-testid={testId}
      size="small"
      color={color}
      onClick={onClick}
      onMouseMove={(e) => {
        e.stopPropagation();
        return false;
      }}
    >
      {children}
    </Fab>
  </Tooltip>
);
