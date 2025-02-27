import useTheme from "@mui/material/styles/useTheme";
import AboutPanelAccordion from "./AboutPanelAccordion";
import Typography from "@mui/material/Typography";

const CopyrightContentSection = () => {
  const theme = useTheme().palette.properties;
  const currentYear = new Date().getFullYear();
  return (
    <AboutPanelAccordion
      name="Copyright"
      idPrefix="AI-about-panel-section-"
      headingText="Copyright"
      content={
        <Typography color={theme.text} marginLeft={1} fontSize="small">
          Copyright Hottinger Bruel & Kjaer UK Ltd {currentYear}
        </Typography>
      }
    ></AboutPanelAccordion>
  );
};

export default CopyrightContentSection;
