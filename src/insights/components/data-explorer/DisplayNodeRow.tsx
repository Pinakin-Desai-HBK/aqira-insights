import { memo, useCallback, useMemo } from "react";
import { DATA_EXPLORER_ROW_HEIGHT } from "src/insights/consts/consts";
import { DragAndDropDataFormat } from "../../enums/enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { uiDataPanel_setDragAndDrop } from "src/insights/redux/slices/ui/dataPanel/dataPanelSlice";
import { NetworkDisplayNodeItem } from "src/insights/redux/types/ui/dataExplorer";
import { DataItem } from "./group/DataItem";
import { DisplayNodeTooltip } from "./tooltips/DisplayNodeTooltip";
import { selectStore_UI_Workspace_NodeTypesData } from "src/insights/redux/slices/ui/workspace/workspaceSlice";

export const DisplayNodeRow = memo(
  ({
    index,
    style,
    current
  }: {
    index: number;
    style: React.CSSProperties;
    current: NetworkDisplayNodeItem | undefined;
  }) => {
    const appDispatch = useAppDispatch();
    const testId = useMemo(
      () => `AI-network-display-node-items-${current?.item.networkName}:${current?.node.name}`,
      [current]
    );
    const nodeTypes = useAppSelector(selectStore_UI_Workspace_NodeTypesData);
    const onDragStart = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        if (!current) return;
        const { item, node } = current;
        const displayNode = item.networkName + ";DisplayNode=" + node.name;
        event.dataTransfer.setData(DragAndDropDataFormat.Display, JSON.stringify({ displayNode }));
        appDispatch(uiDataPanel_setDragAndDrop({ dragging: "DisplayNode", count: 1 }));
      },
      [appDispatch, current]
    );
    const onDragEnd = useCallback(() => {
      appDispatch(uiDataPanel_setDragAndDrop({ dragging: null, count: 0 }));
    }, [appDispatch]);
    const createTooltipContent = useCallback(() => {
      if (!current) return null;
      return <DisplayNodeTooltip {...{ testIdPrefix: testId, displayNode: current }} />;
    }, [current, testId]);

    if (!current) return null;
    const { item, node } = current;

    const displayData = nodeTypes!.itemsMap[node.type];
    return (
      <DataItem
        {...{
          openMenu: null,
          style,
          index,
          source: current,
          name: node.name,
          displayName: `${item.networkName} : ${node.name}`,
          testId,
          icon: (
            <img
              data-testid={`AI-node-icon-${node.name}`}
              src={`data:image/svg+xml;base64,${btoa(displayData?.icon ?? "")}`}
              height={`${DATA_EXPLORER_ROW_HEIGHT * 0.6}px`}
              style={{ background: "white", borderRadius: "2px", margin: "0 2px 0 4px", width: "18px", height: "21px" }}
            />
          ),
          onDragStart,
          onDragEnd,
          createTooltipContent
        }}
      />
    );
  }
);
DisplayNodeRow.displayName = "Row";
