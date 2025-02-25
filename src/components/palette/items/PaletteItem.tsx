import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import PaletteItemDraggable from "./PaletteItemDraggable";
import { PaletteContext } from "../context/PaletteContext";
import { Icon } from "src/components/icon/Icon";
import { PaletteItemProps } from "src/redux/types/ui/palette";
import { appLabels } from "src/consts/labels";
import { useGetPropertiesDataForTypeQuery } from "src/redux/api/appApi";
import { useAppDispatch } from "src/redux/hooks/hooks";
import { uiWorkspace_setCurrentlyDraggingProperties } from "src/redux/slices/ui/workspace/workspaceSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import useTheme from "@mui/material/styles/useTheme";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const labels = appLabels.PaletteItem;

const PaletteItem = memo(({ item }: PaletteItemProps) => {
  const { dataFormat, idPart, displayMode, type } = useContext(PaletteContext);
  const theme = useTheme();
  const appDispatch = useAppDispatch();
  const paletteTheme = theme.palette[type === "NodeContent" ? "panelNodePalette" : "panelVisualizationPalette"];
  const itemDraggable = useRef(null);
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const { data: properties } = useGetPropertiesDataForTypeQuery(
    selected
      ? {
          type: item.type,
          workspaceType: type === "NodeContent" ? "Network" : "Dashboard"
        }
      : skipToken
  );

  useEffect(() => setShowTitle(displayMode === "titles"), [displayMode]);

  useEffect(() => {
    if (properties && selected) {
      appDispatch(uiWorkspace_setCurrentlyDraggingProperties({ currentlyDraggingProperties: properties }));
    }
  }, [appDispatch, dataFormat, selected, item, properties]);

  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement> | undefined) => {
      if (!event) return;
      event.dataTransfer.setData(dataFormat, JSON.stringify(item));
      if (!itemDraggable.current) return;
      setSelected(true);
      event.dataTransfer.setDragImage(itemDraggable.current, 75, 37);
    },
    [dataFormat, item]
  );

  const onDragEnd = useCallback(() => {
    setSelected(false);
    appDispatch(uiWorkspace_setCurrentlyDraggingProperties({ currentlyDraggingProperties: null }));
  }, [appDispatch]);

  return (
    <Tooltip
      title={`${item.name || item.type} ${type === "NodeContent" ? labels.node : labels.visualization}`}
      placement="top"
      disableInteractive
    >
      <Box
        sx={{
          background: paletteTheme.background,
          "&:hover": {
            background: paletteTheme.hoverBackground,
            cursor: "grab"
          },
          width: showTitle ? "95px" : "60px",
          height: showTitle ? "95px" : "60px",
          overflow: "hidden",
          padding: "4px",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
        data-testid={`${idPart}-item-${item.type}`}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Icon
          src={`data:image/svg+xml;base64,${btoa(item.icon)}`}
          style={{ width: "26px", height: showTitle ? "auto" : "55px" }}
        />
        {showTitle && (
          <Typography
            color="text.secondary"
            fontSize={12}
            data-testid={`${idPart}-palette-item-title-${item.type}`}
            sx={{ paddingTop: "3px" }}
          >
            {item.name || item.type}
          </Typography>
        )}
        <PaletteItemDraggable ref={itemDraggable} color={item.color} icon={item.icon} selected={selected} />
      </Box>
    </Tooltip>
  );
});

PaletteItem.displayName = "PaletteItem";

export default PaletteItem;
