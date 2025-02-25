import Add from "@mui/icons-material/Add";
import { WorkSpaceTabs } from "./tabs/WorkspaceTabs";
import { memo, useEffect, useState } from "react";
import { useAppSelector } from "src/redux/hooks/hooks";
import { selectStore_UI_Project_HasWorkspaces } from "src/redux/slices/ui/project/projectSlice";
import { DashboardIcon, NetworkIcon } from "src/components/icon/Icon";
import { ActionTypes } from "src/redux/types/actions";
import { useCreateWorkspaceMutation } from "src/redux/api/appApi";
import { MenuItem } from "src/redux/types/ui/menu";
import { MenuButton } from "../menu/MenuButton";
import { appLabels } from "src/consts/labels";

const actionLabels = appLabels.actions;

export const WorkspaceHeader = memo(() => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mutateCreateWorkspace] = useCreateWorkspaceMutation();
  useEffect(() => {
    const createNetworkAction: MenuItem = {
      type: "Action",
      action: {
        handler: () => mutateCreateWorkspace({ workspace: { type: "Network" } }),
        icon: NetworkIcon({ width: "24px", height: "20px", padding: "2px", marginRight: "5px" }),
        params: {
          type: ActionTypes.CreateNetworkAction,
          message: {},
          label: "New Network",
          tooltip: actionLabels.createANewNetwork
        }
      }
    };
    const createDashboardAction: MenuItem = {
      type: "Action",
      action: {
        handler: () => mutateCreateWorkspace({ workspace: { type: "Dashboard" } }),
        icon: DashboardIcon({ width: "24px", height: "20px", padding: "2px", marginRight: "5px" }),
        params: {
          type: ActionTypes.CreateDashboardAction,
          message: {},
          label: "New Dashboard",
          tooltip: actionLabels.createANewDashboard
        }
      }
    };
    setMenuItems([createNetworkAction, createDashboardAction]);
  }, [mutateCreateWorkspace]);
  const [childOpen, setChildOpen] = useState(false);
  const hasWorkspaces = useAppSelector(selectStore_UI_Project_HasWorkspaces);
  return hasWorkspaces ? (
    <div className="Workspace_Header" data-testid="WorkspaceHeader">
      <WorkSpaceTabs />
      <div className="Workspace_Header_New" data-testid="WorkspaceHeaderNewCanvas">
        <MenuButton
          dataTestId="WorkspaceHeaderCreateMenu"
          id="add-menu"
          items={menuItems}
          prefix="add-menu"
          tooltip="Create a new network or dashboard"
          tooltipOffset={[0, -10]}
          openElement={<Add fontSize="large" sx={{ cursor: "pointer" }} />}
          sxButton={{ borderRadius: "50%", padding: "0px" }}
          onOpen={() => setChildOpen(true)}
          onClose={() => {
            setChildOpen(false);
          }}
          childOpen={childOpen}
          setChildOpen={setChildOpen}
        />
      </div>
    </div>
  ) : null;
});
WorkspaceHeader.displayName = "WorkspaceHeader";
