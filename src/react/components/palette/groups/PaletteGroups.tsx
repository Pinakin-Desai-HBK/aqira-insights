import styles from "../Palette.module.css";
import PaletteGroupIcon from "./PaletteGroupIcon";
import PaletteItem from "../items/PaletteItem";
import { memo, useContext } from "react";
import { PaletteContext } from "../context/PaletteContext";
import AccordionGroup from "src/react/components/accordion-group/AccordionGroup";
import Grid from "@mui/material/Grid2";
import { PaletteItemData } from "src/react/redux/types/ui/palette";
import { appLabels } from "src/react/consts/labels";
import useTheme from "@mui/material/styles/useTheme";

const renderGroupHeading = (name: string, groupColour: string) => (
  <>
    <div className={styles.groupIcon}>
      <PaletteGroupIcon color={groupColour} />
    </div>
    <span className={styles.groupLabel}>{`${name}`}</span>
  </>
);

const labels = appLabels.PaletteGroups;

const PaletteGroups = memo(() => {
  const { idPart, paletteData, openGroups, type, paletteContextDispatch } = useContext(PaletteContext);
  const theme = useTheme();
  const paletteTheme = theme.palette[type === "NodeContent" ? "panelNodePalette" : "panelVisualizationPalette"];

  return paletteData.groups.map((groupName) => (
    <AccordionGroup
      key={groupName}
      name={groupName}
      idPrefix={`${idPart}-group-`}
      toggleTheme={paletteTheme}
      heading={renderGroupHeading(groupName, paletteData.groupColours[groupName] || "")}
      sxDetails={{
        background: paletteTheme.itemsBackground,
        padding: 1,
        "& .MuiAccordionDetails-root": { padding: "8px 0 8px 8px" }
      }}
      optional={{
        expanded: openGroups.includes(groupName),
        onChange: (_e, expanded) =>
          paletteContextDispatch({ type: "toggleGroup", payload: { expanded, group: groupName } })
      }}
      toggleLabel={type === "NodeContent" ? `${groupName} ${labels.nodes}` : `${groupName} ${labels.visualizations}`}
    >
      <Grid key={`${groupName}`} container spacing={1} size={{ xs: 12 }}>
        {paletteData.groupItemsMap[groupName]?.map((item: PaletteItemData) => (
          <Grid key={`${groupName}-${item.name}-${item.type}`}>
            <PaletteItem item={item} />
          </Grid>
        ))}
      </Grid>
    </AccordionGroup>
  ));
});

PaletteGroups.displayName = "PaletteGroups";

export default PaletteGroups;
