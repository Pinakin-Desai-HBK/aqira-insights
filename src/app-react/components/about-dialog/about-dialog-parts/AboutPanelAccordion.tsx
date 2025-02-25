import { Typography, useTheme } from "@mui/material";
import AccordionGroup from "../../accordion-group/AccordionGroup";
import { AboutPanelAccordionProps } from "src/redux/types/ui/aboutPanel";
import { appLabels } from "src/consts/labels";
import { useState } from "react";

const labels = appLabels.AboutPanelAccordion;
const AboutPanelAccordion = ({
  name,
  idPrefix,
  headingText,
  content,
  showDivider = true,
  sx,
  sxDetails,
  sxSummary,
  optional
}: AboutPanelAccordionProps) => {
  const theme = useTheme().palette.properties;
  const [expanded, setExpanded] = useState(true);
  return (
    <AccordionGroup
      name={name}
      idPrefix={idPrefix}
      toggleTheme={theme}
      heading={
        <Typography color={theme.text} marginLeft={1} fontSize="15px">
          {headingText}
        </Typography>
      }
      sx={{
        background: theme.input,
        margin: "8px 8px",
        borderRadius: 2,
        padding: "2px 0",
        overflowY: "auto",
        ...sx
      }}
      sxDetails={{
        padding: "8px 8px",
        ...sxDetails
      }}
      sxSummary={{
        "& .MuiSvgIcon-root": { fontSize: "12px" },
        flexDirection: "row-reverse",
        ...sxSummary
      }}
      optional={{
        expanded,
        onChange: (_e, expanded) => setExpanded(expanded),
        ...optional
      }}
      showDivider={showDivider}
      sxDivider={{
        margin: "0 auto",
        width: "95%",
        height: "2px"
      }}
      toggleLabel={labels.details}
    >
      {content}
    </AccordionGroup>
  );
};

export default AboutPanelAccordion;
