import styles from "./Palette.module.css";
import Search from "../search/Search";
import PaletteSearchResults from "./groups/PaletteSearchResults";
import Panel from "../panel/ContentPanel";
import PaletteOptions from "./controls/PaletteOptions";
import PaletteGroups from "./groups/PaletteGroups";
import { PaletteContext } from "./context/PaletteContext";
import { memo } from "react";
import { PaletteContentType } from "src/react/redux/types/ui/palette";
import { usePaletteContext } from "./context/usePaletteContext";
import useTheme from "@mui/material/styles/useTheme";

const Palette = memo(({ type }: { type: PaletteContentType }) => {
  const theme = useTheme();
  const paletteContextData = usePaletteContext(type);
  const { title, idPart, searchText, itemLabel, paletteContextDispatch } = paletteContextData;
  const paletteTheme = theme.palette[type === "NodeContent" ? "panelNodePalette" : "panelVisualizationPalette"];
  return (
    <PaletteContext.Provider value={paletteContextData}>
      <Panel
        title={title}
        background={paletteTheme.background}
        sx={{ paddingRight: "1px" }}
        titleColor="text.secondary"
        options={<PaletteOptions />}
      >
        <>
          <div className={styles.searchContainer}>
            <Search
              onSearchTextChange={(searchText) =>
                paletteContextDispatch({ type: "setSearchText", payload: { searchText } })
              }
              placeholder={`Search ${itemLabel}s`}
              type={type === "NodeContent" ? "nodes" : "visualizations"}
              themeSearch={theme.palette.searchPalette}
            />
          </div>
          <div
            className={`${styles.itemsContainer} ${idPart}-palette-container`}
            data-testid={`${idPart}-palette-container`}
          >
            {searchText ? <PaletteSearchResults /> : <PaletteGroups />}
          </div>
        </>
      </Panel>
    </PaletteContext.Provider>
  );
});

Palette.displayName = "Palette";

export default Palette;
