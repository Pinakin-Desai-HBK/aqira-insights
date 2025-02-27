import { useEffect, useState } from "react";
import {
  ToolbarActionsHandlers,
  ToolbarSetActionsHandlers,
  ToolbarActionCallbacks,
  UseDashboardToolbarContextType,
  toolbarTargetActions,
  ToolbarTargetActionsKeys,
  ToolbarActions
} from "src/react/redux/types/ui/toolbar";
import { ToolbarTypes, ToolbarTargetTypes, CanvasTypes } from "../../../../redux/types/ui/toolbar";

export const useDashboardToolbarContext: UseDashboardToolbarContextType<
  CanvasTypes,
  ToolbarTypes,
  ToolbarTargetTypes
> = (canvasType, toolbarType, nodeType) => {
  const [state, setState] = useState<{
    handlers: ToolbarActionsHandlers<ToolbarTargetActionsKeys>;
    handlerSetters: ToolbarSetActionsHandlers<ToolbarTargetActionsKeys>;
    handlersSet: boolean;
    actions: ToolbarActions<ToolbarTargetActionsKeys>;
    key: ToolbarTargetActionsKeys;
  } | null>(null);

  useEffect(() => {
    const key = `${canvasType}-${toolbarType}-${nodeType}`;
    if (!(key in toolbarTargetActions)) {
      return;
    }
    const toolbarActionsKey = key as ToolbarTargetActionsKeys;
    const actions = toolbarTargetActions[toolbarActionsKey];
    const { actionMap } = actions;
    const actionMapKeys = Object.keys(actionMap) as Array<keyof typeof actionMap>;

    const handlers = actionMapKeys.reduce(
      (result, key) => ({
        ...result,
        [key]: {
          onClick: null,
          isVisible: null
        }
      }),
      {} as ToolbarActionsHandlers<ToolbarTargetActionsKeys>
    );

    const handlersSet = actionMapKeys.reduce(
      (result, key) => {
        const { isVisible, onClick } = handlers[key];
        const isSet = isVisible !== null && onClick !== null;
        const count = isSet ? result.count + 1 : result.count;
        const total = result.total + 1;
        return {
          count,
          total,
          result: count === total
        };
      },
      { count: 0, total: 0, result: true }
    );

    const handlerSetters = actionMapKeys.reduce(
      (result, key) => ({
        ...result,
        [`set${key}`]: ({ callbacks }: { callbacks: ToolbarActionCallbacks }) => {
          setState((prevState) => {
            return {
              ...(prevState ? prevState : {}),
              handlers: {
                ...(prevState ? prevState.handlers : {}),
                [key]: callbacks
              }
            } as typeof state;
          });
        }
      }),
      {} as ToolbarSetActionsHandlers<ToolbarTargetActionsKeys>
    );

    setState({
      handlers,
      handlerSetters,
      handlersSet: handlersSet.result,
      actions,
      key: key as ToolbarTargetActionsKeys
    });
  }, [canvasType, toolbarType, nodeType]);

  return state ? state : null;
};
