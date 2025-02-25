import { Button, Tooltip, useTheme } from "@mui/material";
import { NodeToolbar as ReactFlowNodeToolbar, Position } from "reactflow";
import { NodeToolbarProps } from "src/redux/types/ui/toolbar";
import { useMemo } from "react";
import { typedObjectKeys } from "../../../redux/types/typeUtils";

export const NodeToolbar = ({ show, actions, handlers, name, locked, selected }: NodeToolbarProps) => {
  const { actionMap, actionOrder } = actions;
  const theme = useTheme();
  const showToolbar = useMemo(
    () =>
      show &&
      typedObjectKeys(handlers).reduce((result, key) => {
        const handler = handlers[key];
        if (handler === null) return result;
        const { isVisible } = handler;
        return result || (isVisible !== null && isVisible());
      }, false),
    [handlers, show]
  );

  return showToolbar ? (
    <ReactFlowNodeToolbar position={Position.Top} isVisible={true}>
      <div
        data-testid={`AI-node-${name}-toolbar`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          width: "100%",
          position: "relative",
          top: !locked && selected ? "14px" : "11px",
          border: `1px solid ${theme.palette.toolbar.border}`,
          borderRadius: "5px",
          backgroundColor: theme.palette.toolbar.background,
          pointerEvents: "auto"
        }}
      >
        {(Object.keys(actionOrder) as (keyof typeof actionOrder)[])
          .sort((key1, key2) => {
            const order1 = actionOrder[key1];
            const order2 = actionOrder[key2];
            return order1 - order2;
          })
          .map((key) => {
            const { name: actionName, icon } = actionMap[key];
            if (!(key in handlers)) {
              return null;
            }
            const { isVisible, onClick } = handlers[key as keyof typeof handlers];
            return isVisible && isVisible() ? (
              <Tooltip key={key} title={actionName} disableInteractive>
                <Button
                  sx={{
                    borderRadius: "50%",
                    minWidth: "28px",
                    width: "28px",
                    height: "28px",
                    margin: "5px 10px",
                    overflow: "hidden",
                    color: theme.palette.toolbar.color,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)"
                    }
                  }}
                  tabIndex={0}
                  data-testid={`AI-node-${name}-toolbar-${key}-button`}
                  type="button"
                  className="nodrag nopan nowheel"
                  key={key}
                  onClick={() => {
                    if (onClick != null) onClick();
                  }}
                >
                  {icon}
                </Button>
              </Tooltip>
            ) : null;
          })}
      </div>
    </ReactFlowNodeToolbar>
  ) : null;
};
