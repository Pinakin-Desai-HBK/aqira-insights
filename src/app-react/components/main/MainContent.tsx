import { memo } from "react";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import "./Main.css";
import { Toast } from "../toast/Toast";
import { Workspace } from "../workspace/Workspace";
import { useMainContent } from "./hooks/useMainContent";

const MainContent = memo(() => {
  const { initialSelectedPaletteItems, isPopout, selectedPaletteItems, setSelectedPaletteItems } = useMainContent();

  return (
    <Grid
      className="main"
      container
      style={isPopout ? { minHeight: "400px", minWidth: "400px" } : { minHeight: "600px", minWidth: "900px" }}
    >
      <Toast
        toastKey={"app-toast"}
        sx={{
          position: "absolute !important",
          top: isPopout ? "19px !important" : "59px !important",
          right: "20px !important",
          bottom: "unset !important",
          justifyContent: "flex-end",
          pointerEvents: "none !important",
          backgroundColor: "transparent"
        }}
      />
      <Grid sx={{ height: "56px" }} size={{ xs: 12 }}>
        <Header />
      </Grid>
      <Grid sx={{ height: "calc(100% - 56px)", padding: "5px", paddingTop: 0 }} size="grow">
        <Stack sx={{ width: 1, height: 1 }} direction="row">
          <Sidebar
            setSelectedPaletteItems={setSelectedPaletteItems}
            initialSelectedPaletteItems={initialSelectedPaletteItems}
          />
          <Workspace selectedPaletteItems={selectedPaletteItems} />
        </Stack>
      </Grid>
    </Grid>
  );
});
MainContent.displayName = "MainContent";

export default MainContent;
