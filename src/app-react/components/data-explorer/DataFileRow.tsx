import { memo, MouseEvent, useCallback, useContext, useMemo } from "react";
import { DragAndDropDataFormat } from "../../enums/enums";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { SelectionContext } from "./selection/SelectionContext";
import { DataFileItem, DataGroupItem, SelectionContextData } from "src/redux/types/ui/dataExplorer";
import { DATA_EXPLORER_ROW_HEIGHT } from "src/consts/consts";
import { DataItem } from "./group/DataItem";
import { getSelectedItemsInfo } from "./getSelectedItemsInfo";
import { DataFileTooltip } from "./tooltips/DataFileTooltip";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { uiDataPanel_setDragAndDrop } from "src/redux/slices/ui/dataPanel/dataPanelSlice";

export const DataFileRow = memo(
  (props: {
    index: number;
    style: React.CSSProperties;
    current: DataFileItem | undefined;
    openMenu: null | ((e: MouseEvent<HTMLDivElement>, source: DataGroupItem) => void);
    openColumnDetails: (params: { source: DataFileItem }) => void;
  }) => {
    const appDispatch = useAppDispatch();
    const { current, style, index, openMenu, openColumnDetails } = props;
    const testId = useMemo(() => `AI-data-explorer-file-${current?.item.name}`, [current]);
    const { getSelectedItems } = useContext(SelectionContext) as SelectionContextData<DataFileItem>;
    const onDragStart = useCallback(
      (event: React.DragEvent<HTMLDivElement>, isSelected: boolean) => {
        if (!current) return;
        const selectedItems = getSelectedItems();
        const selectedDataInfo = getSelectedItemsInfo(current, selectedItems, isSelected);
        event.dataTransfer.setData(DragAndDropDataFormat.Data, selectedDataInfo.string);
        appDispatch(
          uiDataPanel_setDragAndDrop({
            dragging: "File",
            count: selectedDataInfo.count
          })
        );
      },
      [current, getSelectedItems, appDispatch]
    );
    const onDragEnd = useCallback(() => {
      appDispatch(uiDataPanel_setDragAndDrop({ dragging: null, count: 0 }));
    }, [appDispatch]);
    const createTooltipContent = useCallback(
      (props: { closeTooltip: () => void }) => {
        if (!current) return null;
        const { closeTooltip } = props;
        return <DataFileTooltip {...{ testIdPrefix: testId, closeTooltip, openColumnDetails, dataFile: current }} />;
      },
      [current, openColumnDetails, testId]
    );

    if (!current) return null;
    const {
      item: { name }
    } = current;
    return (
      <DataItem
        {...{
          style,
          index,
          source: current,
          name,
          displayName: name,
          testId,
          openMenu,
          createTooltipContent,
          icon: <InsertDriveFileIcon sx={{ color: "text.secondary", height: `${DATA_EXPLORER_ROW_HEIGHT}px` }} />,
          onDragStart,
          onDragEnd
        }}
      />
    );
  }
);
DataFileRow.displayName = "DataFileRow";
