import { memo } from "react";
import NewNetwork from "../../../assets/svg/new-network.svg";
import NewDashboard from "../../../assets/svg/new-dashboard.svg";
import { ActionTypes, MenuActionHandler } from "../../../redux/types/actions";
import "./LandingPage.css";
import { useCreateWorkspaceMutation } from "src/insights/redux/api/appApi";
import LandingPageItem from "./LandingPageItem";
import { appLabels } from "src/insights/consts/labels";
import useTheme from "@mui/material/styles/useTheme";

const actionLabels = appLabels.actions;

const LandingPage = memo(() => {
  const [mutateCreateWorkspace] = useCreateWorkspaceMutation();
  const handler: MenuActionHandler = ({ type }) => {
    switch (type) {
      case "CreateNetworkAction": {
        mutateCreateWorkspace({ workspace: { type: "Network" } });
        break;
      }
      case "CreateDashboardAction":
        mutateCreateWorkspace({ workspace: { type: "Dashboard" } });
        break;
    }
  };
  const {
    palette: {
      landingPage: { subText, dashboard, network }
    }
  } = useTheme();
  return (
    <div className="LandingPage" data-testid="LandingPage">
      <LandingPageItem
        action={() => {
          handler({
            message: {},
            type: ActionTypes.CreateNetworkAction,
            label: actionLabels.newNetwork,
            tooltip: actionLabels.createANewNetwork
          });
        }}
        iconSource={NewNetwork}
        text="New Network"
        description={["Click to create a network"]}
        className="ItemNetwork"
        theme={network}
        subTextColour={subText}
      />
      <LandingPageItem
        action={() => {
          handler({
            message: {},
            type: ActionTypes.CreateDashboardAction,
            label: actionLabels.newDashboard,
            tooltip: actionLabels.createANewDashboard
          });
        }}
        iconSource={NewDashboard}
        text="New Dashboard"
        description={["Click to create a dashboard"]}
        className="ItemDashboard"
        theme={dashboard}
        subTextColour={subText}
      />
    </div>
  );
});
LandingPage.displayName = "Workspace";

export default LandingPage;
