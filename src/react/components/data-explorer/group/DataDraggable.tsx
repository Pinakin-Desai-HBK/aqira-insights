import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { forwardRef } from "react";
import { DataDraggableProps, DataDraggableType } from "src/react/redux/types/ui/dataExplorer";

// Note: if the draggable element is over 300 pixels wide it will have a faded effect applied to it.
export const DataDraggable: DataDraggableType = forwardRef<HTMLDivElement, DataDraggableProps>(
  ({ color, name, dragging, icon }, ref) => (
    <div ref={ref} style={{ position: "fixed", left: -10000 }}>
      {dragging && (
        <Box
          flexDirection="row"
          style={{
            height: "40px",
            maxWidth: "300px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            padding: "5px",
            backgroundColor: "#1d7978"
          }}
        >
          {icon}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            data-testid="data-draggable"
          >
            <Typography
              sx={{ color }}
              marginLeft={"5px"}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow={"hidden"}
              maxWidth={"245px"}
              fontSize={"12px"}
            >
              {name}
            </Typography>
          </Box>
        </Box>
      )}
    </div>
  )
);
DataDraggable.displayName = "DataDraggable";
