import { useCallback, useContext } from "react";
import { getTypeDiscriminator, getValue } from "../../properties/property/usePropertyUtils";
import { OnResize, OnResizeEnd, ResizeDragEvent, ResizeParams, ResizeParamsWithDirection } from "reactflow";
import { useAppDispatch } from "src/insights/redux/hooks/hooks";
import {
  uiWorkspace_blockProperties,
  uiWorkspace_setItemDimensions,
  uiWorkspace_setResizingItemEnd,
  uiWorkspace_setResizingItemStart,
  uiWorkspace_unblockProperties
} from "src/insights/redux/slices/ui/workspace/workspaceSlice";
import { useUpdatePropertyMutation, useUpdateWorkspaceItemPositionMutation } from "src/insights/redux/api/appApi";
import { VisualizationDetailsContext } from "../context/VisualizationDetailsContext";
import { DASHBOARD_SNAP_INTERVAL } from "src/insights/consts/consts";
import { preparePosition } from "src/insights/components/workspace-canvas/utils/preparePosition";

export const useResizeVisualization = () => {
  const details = useContext(VisualizationDetailsContext);
  const appDispatch = useAppDispatch();
  const [updateVisualizationPositionMutation] = useUpdateWorkspaceItemPositionMutation();
  const [updatePropertyMutation] = useUpdatePropertyMutation();

  const onResizeEnd: OnResizeEnd = useCallback(
    async (_event: ResizeDragEvent, { width, height, x, y }: ResizeParams) => {
      const remX = width % DASHBOARD_SNAP_INTERVAL;
      const remY = height % DASHBOARD_SNAP_INTERVAL;
      let adjustedWidth = width;
      let adjustedHeight = height;
      if (remX > DASHBOARD_SNAP_INTERVAL / 2) adjustedWidth = width + (DASHBOARD_SNAP_INTERVAL - remX);
      else adjustedWidth = width - remX;
      if (remY > DASHBOARD_SNAP_INTERVAL / 2) adjustedHeight = height + (DASHBOARD_SNAP_INTERVAL - remY);
      else adjustedHeight = height - remY;

      const { type, id, workspace } = details;

      await updateVisualizationPositionMutation({
        workspace,
        workspaceItem: { type, id },
        newPosition: preparePosition({ x, y })
      });
      await updatePropertyMutation({
        item: { workspace, workspaceItem: { type, id } },
        propertyName: "Width",
        details: {
          type: getTypeDiscriminator(adjustedWidth),
          value: getValue(adjustedWidth)
        }
      });
      await updatePropertyMutation({
        item: { workspace, workspaceItem: { type, id } },
        propertyName: "Height",
        details: {
          type: getTypeDiscriminator(adjustedHeight),
          value: getValue(adjustedHeight)
        }
      });
      setTimeout(() => {
        appDispatch(uiWorkspace_setItemDimensions({ itemId: details.id, itemDimensions: { width, height } }));
        appDispatch(uiWorkspace_unblockProperties());
        appDispatch(uiWorkspace_setResizingItemEnd());
      }, 250);
    },
    [details, appDispatch, updateVisualizationPositionMutation, updatePropertyMutation]
  );

  const onResize: OnResize = useCallback(
    (_event: ResizeDragEvent, { width, height }: ResizeParamsWithDirection) => {
      appDispatch(uiWorkspace_blockProperties());
      appDispatch(uiWorkspace_setItemDimensions({ itemId: details.id, itemDimensions: { width, height } }));
      appDispatch(uiWorkspace_setResizingItemStart({ itemId: details.id }));
    },
    [appDispatch, details.id]
  );

  return { onResize, onResizeEnd };
};
