import { Box } from "@mui/material";
import { memo, useCallback, useContext, useRef, useState } from "react";
import { DATA_EXPLORER_ROW_HEIGHT } from "src/consts/consts";
import TypographyEllipses from "../../../styled-components/typography-ellipsis/TypographyEllipsis";
import { SelectionContext } from "../selection/SelectionContext";
import { DataGroupItem, DataItemProps, DataItemType } from "src/redux/types/ui/dataExplorer";
import { DataDraggable } from "./DataDraggable";
import { DataItemTooltipRenderer } from "./DataItemTooltipRenderer";

export const DataItem: DataItemType<DataGroupItem> = memo(
  ({
    source,
    style,
    displayName,
    icon,
    name,
    testId,
    index,
    onDragEnd,
    onDragStart,
    openMenu,
    createTooltipContent
  }: DataItemProps<DataGroupItem>) => {
    const { dispatch, items, isMultipleSelected, getSelectedItemCount } = useContext(SelectionContext);
    const [dragging, setDragging] = useState(false);
    const itemDraggable = useRef(null);
    const selectionItem = items[index];
    const onContextMenu = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!openMenu) {
          return;
        }
        openMenu(e, source);
      },
      [openMenu, source]
    );
    return (
      <Box
        bgcolor={selectionItem && selectionItem.selected ? "primary.main" : "transparent"}
        style={style}
        display="flex"
        paddingLeft={1}
        paddingRight={1}
        height={`${DATA_EXPLORER_ROW_HEIGHT}px`}
        sx={{ "&:hover": { backgroundColor: "#167170" } }}
        onClick={(e) => {
          dispatch({ type: "selectItem", payload: { ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, index } });
        }}
        onContextMenu={onContextMenu}
      >
        <DataItemTooltipRenderer dragging={dragging} testId={testId} createTooltipContent={createTooltipContent}>
          <Box
            className={selectionItem && selectionItem.selected ? "selected" : ""}
            alignItems="center"
            display="flex"
            sx={{ "&:hover": { cursor: "pointer" } }}
            draggable
            onDragStart={(e) => {
              if (!e || !itemDraggable.current) return;
              onDragStart(e, selectionItem ? selectionItem.selected : false);
              setDragging(true);
              e.dataTransfer.setDragImage(itemDraggable.current, 75, 37);
            }}
            onDragEnd={() => {
              setDragging(false);
              if (onDragEnd) onDragEnd();
            }}
            width={1}
            data-testid={`${testId}`}
          >
            {icon}
            <TypographyEllipses
              data-testid={`${testId}-label`}
              color="text.secondary"
              marginLeft={1}
              marginRight={1}
              fontSize="12px"
            >
              {displayName}
            </TypographyEllipses>
            <DataDraggable
              ref={itemDraggable}
              color="text.secondary"
              dragging={dragging}
              name={
                selectionItem?.selected && isMultipleSelected(selectionItem)
                  ? `${getSelectedItemCount(selectionItem)} Files`
                  : name
              }
              icon={icon}
            />
          </Box>
        </DataItemTooltipRenderer>
      </Box>
    );
  }
);
DataItem.displayName = "DataItem";
