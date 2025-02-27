import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import { forwardRef } from "react";
import { PaletteItemDraggableProps } from "src/react/redux/types/ui/palette";

/* The code below is used to render the image used for the drag&drop.
  It does this off screen by 10000px so that the image is not seen anywhere on the ui to
  edit these change the left property to 0 they will then appear in the side menu */
const PaletteItemDraggable = forwardRef<HTMLDivElement, PaletteItemDraggableProps>(({ color, icon, selected }, ref) => (
  <div ref={ref} style={{ position: "fixed", left: -10000, height: 150, width: 150 }}>
    {selected && (
      <Grid display="flex" justifyContent="center" alignItems="center">
        <Card
          style={{
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex"
          }}
        >
          <Box
            sx={{ borderRadius: "50%", width: 0.9, height: 0.9, border: 5, borderColor: color }}
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <img src={`data:image/svg+xml;base64,${btoa(icon)}`} height="40px" width="40px" />
          </Box>
        </Card>
      </Grid>
    )}
  </div>
));

PaletteItemDraggable.displayName = "PaletteItemDraggable";

export default PaletteItemDraggable;
