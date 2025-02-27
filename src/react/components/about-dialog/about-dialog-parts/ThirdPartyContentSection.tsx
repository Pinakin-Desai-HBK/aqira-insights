import useTheme from "@mui/material/styles/useTheme";
import AboutSection from "./AboutPanelAccordion";
import Typography from "@mui/material/Typography";

const ThirdPartyContentSection = () => {
  const theme = useTheme().palette.properties;
  return (
    <AboutSection
      name="ThirdPartyLicenses"
      idPrefix="AI-about-panel-section-"
      headingText="Third party licenses"
      content={
        <Typography color={theme.text} marginLeft={1} fontSize="small">
          Further information about the components used, including the license text, can be found in the folder labelled
          &quot;About&quot; of the installation directory of this software.
        </Typography>
      }
    ></AboutSection>
  );
};

export default ThirdPartyContentSection;
