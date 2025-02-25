import { MenuItem } from "src/redux/types/ui/menu";
import { Actions, ActionTypes, MenuAction, MenuActionHandler } from "../../../../redux/types/actions";
import { appLabels } from "src/consts/labels";

const createPropertyAction = (handler: MenuActionHandler, params: Actions): MenuAction => ({
  handler,
  icon: null,
  params
});

const createPropertyMenuItem = (handler: MenuActionHandler, params: Actions): MenuItem => ({
  type: "Action",
  action: createPropertyAction(handler, params)
});

const actionLabels = appLabels.actions;

export const createPropertyMenuItems = (handler: MenuActionHandler, isExpression: boolean): MenuItem[] => {
  const switchExpressionAction: MenuItem = createPropertyMenuItem(handler, {
    type: ActionTypes.SwitchExpressionAction,
    message: {},
    label: actionLabels.switchToExpression,
    tooltip: actionLabels.switchThisPropertyToBeAnExpression
  });
  const switchValueAction: MenuItem = createPropertyMenuItem(handler, {
    type: ActionTypes.SwitchValueAction,
    message: {},
    label: actionLabels.switchToValue,
    tooltip: actionLabels.switchThisPropertyToBeAValue
  });
  const editExpressionAction: MenuItem = createPropertyMenuItem(handler, {
    type: ActionTypes.EditExpressionAction,
    message: {},
    label: actionLabels.editExpression,
    tooltip: actionLabels.editTheExpressionForThisProperty
  });
  return isExpression ? [switchValueAction, editExpressionAction] : [switchExpressionAction, editExpressionAction];
};
