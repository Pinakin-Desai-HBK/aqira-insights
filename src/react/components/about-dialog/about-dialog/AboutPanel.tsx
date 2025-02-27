import { memo } from "react";
import CopyrightContentSection from "../about-dialog-parts/CopyRightContentSection";
import ContactUsContentSection from "../about-dialog-parts/ContactUsContentSection";
import ThirdPartyContentSection from "../about-dialog-parts/ThirdPartyContentSection";
import SoftwareVersionSection from "../about-dialog-parts/SoftwareVersionSection";
import { useGetAboutDataQuery } from "../../../redux/api/appApi";
import Stack from "@mui/material/Stack";

const AboutPanel = memo(() => {
  const { data: aboutData } = useGetAboutDataQuery();

  return aboutData ? (
    <Stack data-testid="AI-dialog-about-panel" style={{ margin: "10px 0px" }}>
      <CopyrightContentSection />
      <SoftwareVersionSection
        productName={aboutData.productName}
        releaseFromApi={aboutData.release}
        componentVersions={aboutData.componentVersions}
        productVersions={aboutData.productVersions}
      />
      <ThirdPartyContentSection />
      <ContactUsContentSection />
    </Stack>
  ) : null;
});

AboutPanel.displayName = "AboutPanel";
export default AboutPanel;
