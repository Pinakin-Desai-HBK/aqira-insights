import { ReactFlowInstance, SelectionMode } from "reactflow";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Workspace } from "src/insights/redux/types/schemas/project";
import { useAppDispatch, useAppSelector } from "src/insights/redux/hooks/hooks";
import {
  selectStore_UI_Workspace_ShiftPressed,
  uiWorkspace_blockProperties,
  uiWorkspace_unblockProperties
} from "src/insights/redux/slices/ui/workspace/workspaceSlice";

const panSelectionKeyCode = ["ShiftLeft", "ShiftRight"];
const multiSelectionKeyCode = ["ControlLeft", "ControlRight"];
const deleteKeyCode = ["AltLeft+KeyD", "Backspace", "Delete"];
const proOptions = { hideAttribution: true };
const edgeOptions = { animated: false };
export const minZoom = 0.5;
export const maxZoom = 5.0;
const defaultViewport = {
  x: 0,
  y: 0,
  zoom: 1.0
};

export const useReactFlowConfig = ({ workspace }: { workspace: Workspace }) => {
  const shiftPressed = useAppSelector(selectStore_UI_Workspace_ShiftPressed);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const appDispatch = useAppDispatch();

  const onNodeDragStop = useCallback(() => {
    appDispatch(uiWorkspace_unblockProperties());
  }, [appDispatch]);

  const onSelectionDragStop = useCallback(() => {
    appDispatch(uiWorkspace_unblockProperties());
  }, [appDispatch]);

  const onMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) appDispatch(uiWorkspace_unblockProperties());
    },
    [appDispatch]
  );

  const onMouseUp = useCallback(() => {
    appDispatch(uiWorkspace_unblockProperties());
  }, [appDispatch]);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.buttons === 1) appDispatch(uiWorkspace_blockProperties());
    },
    [appDispatch]
  );

  const onNodeDrag = useCallback(() => {
    appDispatch(uiWorkspace_blockProperties());
  }, [appDispatch]);

  const onSelectionDrag = useCallback(() => {
    appDispatch(uiWorkspace_blockProperties());
  }, [appDispatch]);

  const [className, setClassName] = useState<string>("");
  useEffect(() => {
    setClassName(shiftPressed ? "ShiftPressed" : "");
  }, [shiftPressed]);

  const storeReactFlowViewport = useCallback(() => {
    if (reactFlowInstance) {
      const viewport = reactFlowInstance.getViewport();
      localStorage.setItem(`reactflowViewport-${workspace.id}`, JSON.stringify(viewport));
    }
  }, [reactFlowInstance, workspace.id]);

  useEffect(() => {
    const storedViewport = localStorage.getItem(`reactflowViewport-${workspace.id}`);
    const viewport = storedViewport ? JSON.parse(storedViewport) : null;
    setTimeout(() => {
      reactFlowInstance?.setViewport(viewport || defaultViewport);
    }, 0);
  }, [workspace.id, reactFlowInstance]);

  return {
    reactFlowInstance,
    config: {
      id: workspace.id,
      onInit: setReactFlowInstance,
      onMove: storeReactFlowViewport,
      className,
      multiSelectionKeyCode,
      selectionKeyCode: null,
      deleteKeyCode,
      defaultEdgeOptions: edgeOptions,
      defaultViewport,
      proOptions,
      zoomOnScroll: true,
      zoomOnDoubleClick: false,
      zoomOnPinch: false,
      panOnDrag: [2],
      selectionOnDrag: true,
      selectionMode: SelectionMode.Partial,
      nodeDragThreshold: 1,
      selectNodesOnDrag: false,
      autoPanOnConnect: true,
      autoPanOnNodeDrag: true,
      panActivationKeyCode: panSelectionKeyCode,
      onNodeDrag,
      onNodeDragStop,
      onSelectionDrag,
      onSelectionDragStop,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      minZoom,
      maxZoom
    }
  };
};
