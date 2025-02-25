import { Workspace } from "src/redux/types/schemas/project";
import { PlayArrow, Stop } from "@mui/icons-material";
import { useExecutionControls } from "src/components/workspace-canvas/network/custom-controls/useExecutionControls";
import { getTabIcon } from "./utils/getTabIcon";
import { Box, SxProps, Tooltip } from "@mui/material";

const sxProps: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "24px",
  width: "24px",
  borderRadius: "50%",
  marginRight: "5px",
  color: "white"
};

export const TabIconControl = ({
  workspace,
  selected,
  mouseOver,
  childOpen,
  setChildOpen
}: {
  workspace: Workspace;
  selected: boolean;
  mouseOver: boolean;
  childOpen: boolean;
  setChildOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { run, stop, buttonState, waitingForRunStatusUpdate } = useExecutionControls(workspace);
  if (mouseOver && workspace.type === "Network") {
    if (buttonState.show === "run")
      return (
        <Tooltip
          title={buttonState.tooltip || ""}
          placement="top"
          itemScope={true}
          open={childOpen === undefined ? false : childOpen}
          disableHoverListener
          defaultValue={""}
        >
          <Box
            sx={{
              ...sxProps,
              backgroundColor: "#237F7B",
              "&:hover": { backgroundColor: "#136F6B" }
            }}
            data-testid="tab__button-run"
            onClick={(e) => {
              if (buttonState.enabled && !waitingForRunStatusUpdate) run();
              e.stopPropagation();
              e.preventDefault();
              return false;
            }}
            onMouseEnter={() => setChildOpen(true)}
            onMouseLeave={() => setChildOpen(false)}
          >
            <PlayArrow style={{ height: "16px", width: "16px" }} />
          </Box>
        </Tooltip>
      );
    if (buttonState.show === "stop")
      return (
        <Tooltip
          title={buttonState.tooltip || ""}
          placement="top"
          itemScope={true}
          open={childOpen === undefined ? false : childOpen}
          disableHoverListener
          defaultValue={""}
        >
          <Box
            sx={{
              ...sxProps,
              backgroundColor: "red",
              "&:hover": { backgroundColor: "#FF0000AA" }
            }}
            data-testid="tab__button-stop"
            onClick={(e) => {
              if (buttonState.enabled && !waitingForRunStatusUpdate) stop();
              e.stopPropagation();
              e.preventDefault();
              return false;
            }}
          >
            <Stop style={{ height: "16px", width: "16px" }} />
          </Box>
        </Tooltip>
      );
  }
  return getTabIcon({ type: workspace.type, selected });
};
