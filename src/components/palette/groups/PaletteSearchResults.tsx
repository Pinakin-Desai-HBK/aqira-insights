import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material";
import PaletteItem from "../items/PaletteItem";
import { memo, useContext } from "react";
import { PaletteContext } from "../context/PaletteContext";

const PaletteSearchResults = memo(() => {
  const { idPart, searchItems, itemLabelPlural, type } = useContext(PaletteContext);
  const theme = useTheme();
  const paletteTheme = theme.palette[type === "NodeContent" ? "panelNodePalette" : "panelVisualizationPalette"];
  return (
    <Grid
      container
      spacing={1}
      size={{ xs: 12 }}
      sx={{
        background: paletteTheme.itemsBackground,
        width: "initial",
        padding: "4px"
      }}
      margin={0}
      data-testid={`${idPart}-search-items`}
    >
      {searchItems.length ? (
        searchItems.map((item) => (
          <Grid key={item.name}>
            <PaletteItem item={item} />
          </Grid>
        ))
      ) : (
        <Typography textAlign="center" width={1} data-testid={`${idPart}-search-no-items`} color="text.secondary">
          No {itemLabelPlural} found
        </Typography>
      )}
    </Grid>
  );
});

PaletteSearchResults.displayName = "PaletteSearchResults";

export default PaletteSearchResults;
