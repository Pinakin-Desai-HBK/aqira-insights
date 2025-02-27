import { DashboardVisualizationDataUI, VisConfigMap } from "src/react/redux/types/ui/dashboardVisualization";
import { VisualizationDataContextProvider } from "./VisualizationDataContextProvider";
import { NodeToolbarContext } from "./toolbar/context/ToolbarContext";
import { NodeToolbarProvider } from "./toolbar/NodeToolbarProvider";
import { NodeProps, NodeResizer, useReactFlow } from "reactflow";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "src/react/redux/hooks/hooks";
import { useWorkspaceItemDimensions } from "src/react/redux/hooks/useWorkspaceItemDimensions";
import { selectStore_UI_DataPanel_DragAndDrop } from "src/react/redux/slices/ui/dataPanel/dataPanelSlice";
import { useResizeVisualization } from "./hooks/useResizeVisualization";
import { isDataVisualization } from "./utils/isDataVisualization";
import "./ResizeStyles.css";
import { make_selectStore_UI_Workspace_ForDashboardVisualizations } from "src/react/redux/slices/ui/workspace/combinedSelectors";
import { VisualizationDetailsContext } from "./context/VisualizationDetailsContext";
import { MappedDashboardVisualization } from "./MappedDashboardVisualization";
import { selectStore_UI_Workspace_Selecting } from "src/react/redux/slices/ui/workspace/workspaceSlice";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";

export const RenderDashboardVisualization = ({ id, data }: NodeProps<DashboardVisualizationDataUI>) => {
  const { type } = data;
  const details = useContext(VisualizationDetailsContext);
  const theme = useTheme();
  const workspaceSelector = useMemo(make_selectStore_UI_Workspace_ForDashboardVisualizations, []);
  const { locked, multipleSelected, resizingItemId, shiftPressed } = useAppSelector(workspaceSelector);
  const dragAndDrop = useAppSelector(selectStore_UI_DataPanel_DragAndDrop);
  const [showToolbar, setShowToolbar] = useState(false);
  const dimensions = useWorkspaceItemDimensions(id);
  const { onResize, onResizeEnd } = useResizeVisualization();

  const { getNodes } = useReactFlow();
  const [showResizer, setShowResizer] = useState<boolean>(false);

  const isMultipleSelected = useCallback(() => {
    return getNodes().filter((node) => node.selected).length > 1 || multipleSelected;
  }, [getNodes, multipleSelected]);

  const selecting = useAppSelector(selectStore_UI_Workspace_Selecting);
  const selected = getNodes().some((node) => node.id === id && node.selected);
  useEffect(() => {
    setShowResizer(selected && !selecting && !locked && !isMultipleSelected());
  }, [selected, locked, selecting, isMultipleSelected]);

  const onMouseOver = useCallback(() => setShowToolbar(!isMultipleSelected()), [isMultipleSelected]);
  const onMouseOut = useCallback(() => setShowToolbar(false), []);

  if (!details || !dimensions) {
    return null;
  }
  const { minHeight, minWidth, name } = details;
  return (
    <>
      <NodeResizer
        color={theme.palette.canvas.resizerBackground}
        isVisible={showResizer}
        minWidth={minWidth}
        minHeight={minHeight}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
      <div
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-testid={"AI-visualization-" + name}
        data-id={id}
        className={selected ? "selected" : ""}
        style={{
          position: "relative",
          display: "block",
          width: `${resizingItemId === id ? "100%" : `${dimensions.width}px`}`,
          height: `${resizingItemId === id ? "100%" : `${dimensions.height}px`}`,
          backgroundColor: "white",
          boxSizing: "border-box"
        }}
      >
        {!shiftPressed ? (
          <NodeToolbarProvider show={showToolbar} context={NodeToolbarContext} selected={selected} />
        ) : null}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            border: VisConfigMap[type].showBorder || !locked ? "1px solid  rgb(189, 189, 189)" : "none",
            margin: 0,
            overflow: "hidden",
            position: "relative"
          }}
          className={!shiftPressed && locked && !VisConfigMap[type].canPan ? "nodrag nopan nowheel" : ""}
        >
          {isDataVisualization(details) ? <VisualizationDataContextProvider /> : <MappedDashboardVisualization />}
          {(shiftPressed || !locked) && dragAndDrop.dragging === null ? (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              data-testid={"AI-visualization-" + name + "-overlay"}
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                position: "absolute",
                top: "0px",
                left: "0px",
                zIndex: 10000,
                ...(selected && (isMultipleSelected() || selecting) ? { background: "#000", opacity: "0.5" } : {})
              }}
            ></div>
          ) : null}
        </Box>
      </div>
    </>
  );
};
