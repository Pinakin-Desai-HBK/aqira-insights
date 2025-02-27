import { useReactFlow } from "reactflow";
import CenterFocusStrong from "@mui/icons-material/CenterFocusStrong";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Stop from "@mui/icons-material/Stop";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import Box from "@mui/material/Box";
import { memo } from "react";
import { useExecutionControls } from "./useExecutionControls";
import { ControlsFab } from "../../shared/ControlsFab";
import { Workspace } from "src/insights/redux/types/schemas/project";
import { appLabels } from "src/insights/consts/labels";
import { Icon } from "src/insights/components/icon/Icon";
import AutoArrangeIcon from "./auto_arrange.svg";

const labels = appLabels.NetworkCanvasCustomControls;

const NetworkCanvasCustomControls = memo(
  ({ workspace, arrangeNodes }: { workspace: Workspace; arrangeNodes: () => void }) => {
    const { run, stop, buttonState, waitingForRunStatusUpdate } = useExecutionControls(workspace);
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    return (
      <Box
        data-testid="rf__buttonbar"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          justifyContent: "flex-end",
          margin: "20px",
          overflow: "hidden"
        }}
      >
        {buttonState.show === "run" && (
          <ControlsFab
            sx={{
              backgroundColor: "#237F7B",
              color: "white",
              "&:hover": { backgroundColor: "#136F6B" }
            }}
            testId="rf__buttonbar-run"
            title={buttonState.tooltip}
            onClick={() => buttonState.enabled && !waitingForRunStatusUpdate && run()}
          >
            <PlayArrow />
          </ControlsFab>
        )}
        {buttonState.show === "stop" && (
          <ControlsFab
            testId="rf__buttonbar-stop"
            color="error"
            title={buttonState.tooltip}
            onClick={() => buttonState.enabled && !waitingForRunStatusUpdate && stop()}
          >
            <Stop />
          </ControlsFab>
        )}
        <ControlsFab testId="rf__buttonbar-zoomin" title={labels.zoomIn} onClick={zoomIn}>
          <ZoomIn />
        </ControlsFab>
        <ControlsFab testId="rf__buttonbar-fitview" title={labels.resetView} onClick={fitView}>
          <CenterFocusStrong />
        </ControlsFab>
        <ControlsFab testId="rf__buttonbar-zoomout" title={labels.zoomOut} onClick={zoomOut}>
          <ZoomOut />
        </ControlsFab>
        <ControlsFab testId="rf__buttonbar-arrange" title={labels.arrange} onClick={arrangeNodes}>
          <Icon
            src={AutoArrangeIcon}
            style={{ rotate: "270deg", position: "relative", left: "-2px" }}
            inverted={false}
          />
        </ControlsFab>
      </Box>
    );
  }
);
NetworkCanvasCustomControls.displayName = "NetworkCanvasCustomControls";

export default NetworkCanvasCustomControls;
