import { ToggleButton, Tooltip } from "@mui/material";
import { memo } from "react";
import { Icon } from "src/components/icon/Icon";
import { PaletteDisplayButtonProps } from "src/redux/types/ui/palette";

const PaletteDisplayButton = memo(({ displayMode, selected, src, idPart }: PaletteDisplayButtonProps) => (
  <Tooltip title={displayMode === "titles" ? "Show icons and titles" : "Show icons"} disableInteractive>
    <ToggleButton
      value={displayMode}
      aria-label={displayMode}
      data-testid={`${idPart}-palette-display-button-${displayMode}`}
      sx={{
        borderColor: `rgba(255, 255, 255, 0.12)`,
        padding: "2px",
        height: "30px",
        "&:hover": { background: `rgba(255, 255, 255, 0.05)` },
        "&.Mui-selected": { background: `rgba(255, 255, 255, 0.1)` },
        "&.Mui-selected:hover": { background: `rgba(255, 255, 255, 0.15)` }
      }}
    >
      <Icon src={src} alt={`${displayMode} icon`} style={{ width: "20px", opacity: selected ? 1.0 : 0.5 }} />
    </ToggleButton>
  </Tooltip>
));

PaletteDisplayButton.displayName = "PaletteDisplayButton";

export default PaletteDisplayButton;
