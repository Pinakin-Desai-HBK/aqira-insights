import { MenuItem } from "src/redux/types/ui/menu";
import { ActionTypes, MenuActionHandler } from "../../../redux/types/actions";
import { appLabels } from "src/consts/labels";
import Add from "@mui/icons-material/Add";

const actionLabels = appLabels.actions;

export const createHeaderMenuItems = (isDirty: boolean, isSaved: boolean, handler: MenuActionHandler): MenuItem[] => {
  const createNewProjectAction: MenuItem = {
    type: "Action",
    action: {
      handler,
      icon: (
        <Add
          sx={{
            backgroundColor: "#2DA39E",
            color: "white",
            borderRadius: "19px",
            width: "38px",
            height: "38px",
            borderWidth: "0px",
            padding: "5px",
            marginRight: "10px"
          }}
        />
      ),
      params: {
        type: ActionTypes.CreateNewProjectAction,
        message: {},
        label: actionLabels.createNewProject,
        tooltip: actionLabels.createANewProject
      }
    }
  };
  const openProjectAction: MenuItem = {
    type: "Action",
    action: {
      handler,
      icon: null,
      params: {
        type: ActionTypes.OpenProjectAction,
        message: {},
        label: actionLabels.open,
        tooltip: actionLabels.openAProject
      }
    }
  };
  const saveProjectAction: MenuItem = {
    type: "Action",
    action: {
      handler,
      icon: null,
      params: {
        type: ActionTypes.SaveProjectAction,
        message: {},
        label: actionLabels.save,
        tooltip: actionLabels.saveTheProject
      },
      disabled: !isDirty || !isSaved
    }
  };
  const saveProjectAsAction: MenuItem = {
    type: "Action",
    action: {
      handler,
      icon: null,
      params: {
        type: ActionTypes.SaveProjectAsAction,
        message: {},
        label: actionLabels.saveAs,
        tooltip: actionLabels.saveAProjectAs
      },
      disabled: !isDirty
    }
  };
  const divider: MenuItem = {
    type: "Divider"
  };
  const currentProjectLabel: MenuItem = {
    type: "Label",
    label: "Current Project"
  };
  return [
    createNewProjectAction,
    divider,
    openProjectAction,
    divider,
    currentProjectLabel,
    saveProjectAction,
    saveProjectAsAction
  ];
};
