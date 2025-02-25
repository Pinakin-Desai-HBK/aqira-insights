import { ReactElement } from "react";
import {
  DeleteTabMessage,
  CreateDashboardMessage,
  CreateNetworkMessage,
  PopTabMessage,
  SwitchExpressionMessage,
  SwitchValueMessage,
  EditExpressionMessage,
  EmptyMessage,
  RenameTabMessage,
  ViewColumnDetailsMessage
} from "./ui/messages";
import { appLabels } from "src/consts/labels";
import { JSX } from "react";

export enum ActionTypes {
  DeleteTabAction = "DeleteTabAction",
  RenameTabAction = "RenameTabAction",
  PopTabAction = "PopTabAction",
  CreateNetworkAction = "CreateNetworkAction",
  CreateDashboardAction = "CreateDashboardAction",
  CreateNewProjectAction = "CreateNewProjectAction",
  OpenProjectAction = "OpenProjectAction",
  SaveProjectAction = "SaveProjectAction",
  SaveProjectAsAction = "SaveProjectAsAction",
  SwitchValueAction = "SwitchValueAction",
  SwitchExpressionAction = "SwitchExpressionAction",
  EditExpressionAction = "EditExpressionAction",
  ExportToPythonAction = "ExportToPythonAction",
  ViewColumnDetails = "ViewColumnDetails"
}

type AppLabels = typeof appLabels;
type ActionLabels = AppLabels["actions"];

type ActionParams = {
  [ActionTypes.ViewColumnDetails]: {
    type: ActionTypes.ViewColumnDetails;
    label: ActionLabels["viewDataInformation"];
    message: ViewColumnDetailsMessage;
    tooltip: ActionLabels["viewDataInformationForThisFile"];
  };
  [ActionTypes.SwitchExpressionAction]: {
    type: ActionTypes.SwitchExpressionAction;
    label: ActionLabels["switchToExpression"];
    message: SwitchExpressionMessage;
    tooltip: ActionLabels["switchThisPropertyToBeAnExpression"];
  };
  [ActionTypes.SwitchValueAction]: {
    type: ActionTypes.SwitchValueAction;
    label: ActionLabels["switchToValue"];
    message: SwitchValueMessage;
    tooltip: ActionLabels["switchThisPropertyToBeAValue"];
  };
  [ActionTypes.EditExpressionAction]: {
    type: ActionTypes.EditExpressionAction;
    label: ActionLabels["editExpression"];
    message: EditExpressionMessage;
    tooltip: ActionLabels["editTheExpressionForThisProperty"];
  };
  [ActionTypes.DeleteTabAction]: {
    type: ActionTypes.DeleteTabAction;
    label: ActionLabels["delete"];
    message: DeleteTabMessage;
    tooltip: ActionLabels["deleteThisTab"];
  };
  [ActionTypes.RenameTabAction]: {
    type: ActionTypes.RenameTabAction;
    label: ActionLabels["rename"];
    message: RenameTabMessage;
    tooltip: ActionLabels["renameThisTab"];
  };
  [ActionTypes.PopTabAction]: {
    type: ActionTypes.PopTabAction;
    label: ActionLabels["openInNewWindow"];
    message: PopTabMessage;
    tooltip: ActionLabels["openThisTabInANewWindow"];
  };
  [ActionTypes.CreateNetworkAction]: {
    type: ActionTypes.CreateNetworkAction;
    label: ActionLabels["newNetwork"];
    message: CreateNetworkMessage;
    tooltip: ActionLabels["createANewNetwork"];
  };
  [ActionTypes.CreateDashboardAction]: {
    type: ActionTypes.CreateDashboardAction;
    label: ActionLabels["newDashboard"];
    message: CreateDashboardMessage;
    tooltip: ActionLabels["createANewDashboard"];
  };
  [ActionTypes.CreateNewProjectAction]: {
    type: ActionTypes.CreateNewProjectAction;
    label: ActionLabels["createNewProject"];
    message: EmptyMessage;
    tooltip: ActionLabels["createANewProject"];
  };
  [ActionTypes.OpenProjectAction]: {
    type: ActionTypes.OpenProjectAction;
    label: ActionLabels["open"];
    message: EmptyMessage;
    tooltip: ActionLabels["openAProject"];
  };
  [ActionTypes.SaveProjectAction]: {
    type: ActionTypes.SaveProjectAction;
    label: ActionLabels["save"];
    message: EmptyMessage;
    tooltip: ActionLabels["saveTheProject"];
  };
  [ActionTypes.SaveProjectAsAction]: {
    type: ActionTypes.SaveProjectAsAction;
    label: ActionLabels["saveAs"];
    message: EmptyMessage;
    tooltip: ActionLabels["saveAProjectAs"];
  };
  [ActionTypes.ExportToPythonAction]: {
    type: ActionTypes.ExportToPythonAction;
    label: ActionLabels["exportForAqira"];
    message: EmptyMessage;
    tooltip: ActionLabels["exportTheNetworkForAqira"];
  };
};

export type Actions =
  | ActionParams[ActionTypes.DeleteTabAction]
  | ActionParams[ActionTypes.RenameTabAction]
  | ActionParams[ActionTypes.PopTabAction]
  | ActionParams[ActionTypes.CreateNetworkAction]
  | ActionParams[ActionTypes.CreateDashboardAction]
  | ActionParams[ActionTypes.CreateNewProjectAction]
  | ActionParams[ActionTypes.OpenProjectAction]
  | ActionParams[ActionTypes.SaveProjectAction]
  | ActionParams[ActionTypes.SaveProjectAsAction]
  | ActionParams[ActionTypes.SwitchExpressionAction]
  | ActionParams[ActionTypes.SwitchValueAction]
  | ActionParams[ActionTypes.EditExpressionAction]
  | ActionParams[ActionTypes.ExportToPythonAction]
  | ActionParams[ActionTypes.ViewColumnDetails];

type ActionHandler<T extends ActionParams[keyof ActionParams]> = (params: T) => void;

type Action<T extends ActionParams[keyof ActionParams]> = {
  icon: ReactElement | JSX.Element | null;
  params: T;
  handler: ActionHandler<T>;
  disabled?: boolean;
};

//export type MenuAction = Action<ActionParams[keyof ActionParams]>;

export type MenuActionHandler = ActionHandler<Actions>;
export type MenuAction = Action<Actions>;
