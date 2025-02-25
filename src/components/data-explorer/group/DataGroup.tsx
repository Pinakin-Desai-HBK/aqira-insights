import { FixedSizeList } from "react-window";
import { Box, useTheme } from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import { useContext, useEffect } from "react";
import { SelectionContext } from "../selection/SelectionContext";
import { DataGroupItem, DataGroupProps, DataGroupType } from "src/redux/types/ui/dataExplorer";
import { DATA_EXPLORER_ROW_HEIGHT } from "src/consts/consts";

export const DataGroup: DataGroupType<DataGroupItem> = (props: DataGroupProps<DataGroupItem>) => {
  const { groupItems, allGroupItems, isOpen, minHeight, Row, listTestId, testId } = props;
  const { dispatch: selectionContextDispatch, allItemsRaw, items, itemsRaw, matcher } = useContext(SelectionContext);
  useEffect(() => {
    if (allItemsRaw === allGroupItems || (allItemsRaw.length === 0 && allGroupItems.length === 0)) return;
    selectionContextDispatch({ type: "setAllItems", payload: { allItems: allGroupItems, matcher } });
  }, [allItemsRaw, matcher, allGroupItems, selectionContextDispatch]);

  useEffect(() => {
    if (itemsRaw === groupItems || (itemsRaw.length === 0 && groupItems.length === 0)) return;
    selectionContextDispatch({ type: "setItems", payload: { items: groupItems } });
  }, [groupItems, itemsRaw, selectionContextDispatch]);

  const theme = useTheme();
  return (
    <span
      data-testid={testId}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: isOpen ? 0 : 1,
        flexGrow: isOpen ? 1 : 0
      }}
    >
      {isOpen ? (
        <Box minHeight={minHeight} flexGrow={1} data-testid={listTestId}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={DATA_EXPLORER_ROW_HEIGHT}
                itemCount={items.length}
                overscanCount={5}
                style={{ background: theme.palette.panelDataExplorer.itemsBackground }}
              >
                {Row}
              </FixedSizeList>
            )}
          </AutoSizer>
        </Box>
      ) : null}
    </span>
  );
};
