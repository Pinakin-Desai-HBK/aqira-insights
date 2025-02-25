import { NodeToolbarContextType, NodeToolbarProps } from "src/redux/types/ui/toolbar";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "src/redux/hooks/hooks";
import { NodeToolbar } from "./NodeToolbar";
import { make_selectStore_UI_Workspace_ForNodeToolbarProvider } from "src/redux/slices/ui/workspace/combinedSelectors";
import { VisualizationDetailsContext } from "../context/VisualizationDetailsContext";

export const NodeToolbarProvider = ({
  show,
  context,
  selected
}: {
  show: boolean;
  context: NodeToolbarContextType;
  selected: boolean;
}) => {
  const toolbarContextData = useContext(context);
  const workspaceSelector = useMemo(make_selectStore_UI_Workspace_ForNodeToolbarProvider, []);
  const { locked, restrictedToolbars } = useAppSelector(workspaceSelector);
  const { name, id } = useContext(VisualizationDetailsContext);
  const [toolbarProps, setToolbarProps] = useState<NodeToolbarProps | null>(null);

  useEffect(() => {
    if (!toolbarContextData) {
      return;
    }
    const { actions, handlers } = toolbarContextData;
    setToolbarProps({
      show: show && (!restrictedToolbars || restrictedToolbars.includes(id)),
      actions,
      handlers,
      name,
      locked,
      selected
    });
  }, [id, locked, name, restrictedToolbars, selected, show, toolbarContextData]);

  if (!toolbarProps) {
    return null;
  }
  return <NodeToolbar {...toolbarProps} />;
};
