import { Grid, Typography, useTheme } from "@mui/material";
import AboutPanelAccordion from "./AboutPanelAccordion";
import React from "react";
import { VersionsData } from "src/redux/types/schemas/about";
import { SoftwareVersionSectionProps } from "src/redux/types/ui/aboutPanel";

const SoftwareVersionSection = ({
  releaseFromApi,
  componentVersions,
  productVersions
}: SoftwareVersionSectionProps) => {
  const theme = useTheme().palette.properties;
  const versionsFromApi = productVersions.concat(componentVersions);

  const defaultRelease = "2024 R1";
  const defaultVersions: VersionsData[] = [
    { label: "Product UI", version: "1.30.0" },
    { label: "Installer", version: "0.8.6" },
    { label: "nCodeDS", version: "2.15.0" },
    { label: "Python", version: "3.11.7" }
  ];
  const versions = versionsFromApi.length > 0 ? versionsFromApi : defaultVersions;
  const release = releaseFromApi.length === 0 ? defaultRelease : releaseFromApi;
  const headingText = `Software version - ${release}`;

  return (
    <AboutPanelAccordion
      name="SoftwareVersion"
      idPrefix="AI-about-panel-section-"
      headingText={headingText}
      content={
        <Grid container spacing={0} color={theme.text}>
          {versions.length > 0 ? (
            versions.map((version, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <Typography marginLeft={1} fontSize="small">
                    {version.label}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography marginLeft={1} fontSize="small">
                    {version.version}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))
          ) : (
            <Typography marginLeft={1} fontSize="small">
              No versions available
            </Typography>
          )}
        </Grid>
      }
    ></AboutPanelAccordion>
  );
};

export default SoftwareVersionSection;
