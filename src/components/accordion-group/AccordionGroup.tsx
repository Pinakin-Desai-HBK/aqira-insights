import { Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import { GroupToggle } from "../../redux/types/ui/themes";
import { CollapseIcon, ExpandIcon } from "./ExpandIcon";
import { AccordionGroupProps } from "src/redux/types/ui/accordionGroup";

const getBaseSummarySX = (toggleTheme: GroupToggle, hover: boolean) =>
  hover
    ? { "& .MuiSvgIcon-root": { color: toggleTheme.groupToggleHover } }
    : {
        color: "white",
        "& .MuiSvgIcon-root": { color: toggleTheme.groupToggle },
        "&:hover": { backgroundColor: "inherit" },
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": { transform: "rotate(90deg)" }
      };

const AccordionGroup = ({
  name,
  children,
  idPrefix,
  toggleTheme,
  heading,
  optional,
  sx,
  sxDetails,
  sxSummary,
  showDivider = false,
  sxDivider,
  toggleLabel
}: AccordionGroupProps) => (
  <Accordion
    data-testid={`${idPrefix}${name}`}
    sx={{
      ...{
        background: "none",
        boxShadow: "none",
        "&:before": { display: "none" }
      },
      ...sx
    }}
    disableGutters
    {...optional}
  >
    <AccordionSummary
      data-testid={`${idPrefix}${name}-summary`}
      sx={{
        ...getBaseSummarySX(toggleTheme, false),
        ...sxSummary,
        "&:hover": getBaseSummarySX(toggleTheme, true),
        "& .MuiIconButton-root:hover": { backgroundColor: "rgba(0,0,0,0)" }
      }}
      expandIcon={
        optional?.expanded ? (
          <CollapseIcon title={`Hide ${toggleLabel}`} />
        ) : (
          <ExpandIcon title={`Show ${toggleLabel}`} />
        )
      }
      aria-controls={name}
    >
      {heading}
    </AccordionSummary>
    {showDivider && <Divider sx={{ ...sxDivider }} />}
    <AccordionDetails sx={{ ...sxDetails }}>{children}</AccordionDetails>
  </Accordion>
);

export default AccordionGroup;
