import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { memo, useMemo } from "react";
import HeaderMenu from "./HeaderMenu";
import { appTitle } from "../../consts/consts";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useGetCurrentProjectQuery } from "src/react/redux/api/appApi";
import { selectStore_UI_Project_SelectedWorkspace } from "src/react/redux/slices/ui/project/projectSlice";
import { popoutDetails } from "src/react/popoutDetails";

const Header = memo(() => {
  const { isPopout } = popoutDetails;
  const selectedWorkspace = useAppSelector(selectStore_UI_Project_SelectedWorkspace);
  const { data: project } = useGetCurrentProjectQuery();
  const title = useMemo(() => {
    const title = `${project ? project.name : "(unknown)"}${
      selectedWorkspace && isPopout ? `  ${selectedWorkspace.name}` : ``
    }`;
    window.document.title = `${appTitle} - ${title}`;
    return title;
  }, [isPopout, project, selectedWorkspace]);
  return (
    <Grid container alignItems="center" sx={{ flexFlow: "nowrap", padding: "10px", display: "flex" }}>
      <span data-testid="ai-header" style={{ flexFlow: "nowrap", display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 20, whiteSpace: "nowrap" }} data-testid="ai-header-app-title">
          {appTitle}
        </Typography>
        <div style={{ width: "36px" }}>{isPopout ? " - " : <HeaderMenu width={250} />}</div>
        <Typography
          sx={{ fontWeight: 500, fontSize: 20, whiteSpace: "nowrap" }}
          id="ai-header-project-title"
          data-testid="ai-header-project-title"
        >
          {" "}
          {title}
        </Typography>
      </span>
    </Grid>
  );
});

Header.displayName = "Header";

export default Header;
