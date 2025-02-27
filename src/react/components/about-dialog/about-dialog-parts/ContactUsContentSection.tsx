import useTheme from "@mui/material/styles/useTheme";
import AboutSection from "./AboutPanelAccordion";
import Typography from "@mui/material/Typography";

const ContactUsContentSection = () => {
  const theme = useTheme().palette.properties;
  return (
    <AboutSection
      name="ContactUs"
      idPrefix="AI-about-panel-section-"
      headingText="Contact us"
      content={
        <Typography color={theme.text} marginLeft={1} fontSize="small">
          Visit our website at{" "}
          <a href="https://www.hbkworld.com/en/products/software" target="_blank" rel="noopener noreferrer">
            {" "}
            hbkworld.com/en/products/software
          </a>
          . Report bugs or ask further questions to our{" "}
          <a href="https://www.hbkworld.com/en/services-support/support" target="_blank" rel="noopener noreferrer">
            {" "}
            support website
          </a>
        </Typography>
      }
    ></AboutSection>
  );
};

export default ContactUsContentSection;
