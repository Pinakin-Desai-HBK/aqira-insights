import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import { memo, useContext } from "react";
import PaletteDisplayButton from "./PaletteDisplayButton";
import paletteDisplayIconsSvg from "../../../assets/svg/palette-display-icons.svg";
import paletteDisplayTitlesSvg from "../../../assets/svg/palette-display-titles.svg";
import { PaletteContext } from "../context/PaletteContext";
import { PaletteDisplayMode } from "src/redux/types/ui/palette";

const PaletteOptions = memo(() => {
  const { paletteContextDispatch, displayMode, idPart } = useContext(PaletteContext);

  const onChange = (_event: React.MouseEvent<HTMLElement>, newDisplayMode: PaletteDisplayMode) => {
    if (newDisplayMode === null) return;
    paletteContextDispatch({
      type: "setDisplayMode",
      payload: { displayMode: newDisplayMode }
    });
  };

  return (
    <Box sx={{ margin: "8px 8px 4px 0" }}>
      <ToggleButtonGroup
        size="small"
        exclusive
        aria-label="palette options"
        value={displayMode}
        onChange={onChange}
        data-testid={`${idPart}-palette-display-buttons`}
      >
        <PaletteDisplayButton
          displayMode="icons"
          src={paletteDisplayIconsSvg}
          selected={displayMode === "icons"}
          idPart={idPart}
        />
        <PaletteDisplayButton
          displayMode="titles"
          src={paletteDisplayTitlesSvg}
          selected={displayMode === "titles"}
          idPart={idPart}
        />
      </ToggleButtonGroup>
    </Box>
  );
});

PaletteOptions.displayName = "PaletteOptions";

export default PaletteOptions;
