import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  selectStore_UI_Project_InlineEditingWorkspaceId,
  uiProject_setInlineEditingWorkspaceId,
  uiProject_setScrollToSelected,
  uiProject_setSelectedWorkspace
} from "src/redux/slices/ui/project/projectSlice";
import { useAppDispatch, useAppSelector } from "src/redux/hooks/hooks";
import { InlineEdit } from "src/components/inline-edit/InlineEdit";
import { useUpdateWorkspaceNameMutation } from "src/redux/api/appApi";
import { WorkspaceTabComponentProps } from "src/redux/types/ui/workspaceTabs";
import { workspaceTabNameValidator } from "./utils/workspaceTabNameValidator";
import { useWorkspace } from "./hooks/useWorkspace";
import { useTabMenu } from "./hooks/useTabMenu";
import { TabIconControl } from "./TabIconControl";
import Tooltip from "@mui/material/Tooltip";
import { appLabels } from "src/consts/labels";

const labels = appLabels.WorkspaceTab;

export const WorkspaceTab = memo(({ id, selected, index }: WorkspaceTabComponentProps) => {
  const [parentOpen, setParentOpen] = useState(false);
  const [childControlOpen, setChildControlOpen] = useState(false);
  const [childMenuOpen, setChildMenuOpen] = useState(false);
  const workspaceDetails = useWorkspace({ id });
  const tabMenuDetails = useTabMenu({
    workspaceDetails,
    childOpen: childMenuOpen,
    setChildOpen: setChildMenuOpen,
    setParentOpen
  });
  const [editing, setEditingState] = useState<boolean>(false);
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  const appDispatch = useAppDispatch();
  const tabRef = useRef<HTMLSpanElement | null>(null);
  const inlineEditingWorkspaceId = useAppSelector(selectStore_UI_Project_InlineEditingWorkspaceId);
  const setEditing = useCallback(
    (editing: boolean) => {
      setEditingState(editing);
      appDispatch(uiProject_setInlineEditingWorkspaceId(editing ? id : null));
    },
    [appDispatch, id]
  );
  useEffect(() => {
    if (editing && inlineEditingWorkspaceId !== id) {
      setEditingState(false);
    }
  }, [id, editing, inlineEditingWorkspaceId]);
  const handleClick = useCallback(() => {
    if (!workspaceDetails) {
      return;
    }
    appDispatch(uiProject_setSelectedWorkspace(workspaceDetails.workspace));
    appDispatch(uiProject_setScrollToSelected(true));
  }, [appDispatch, workspaceDetails]);
  const [mutateUpdateWorkspaceName] = useUpdateWorkspaceNameMutation();

  const onUpdate = useCallback(
    (newName: string) => {
      if (!workspaceDetails) return;
      const { name } = workspaceDetails.workspace;
      if (name !== newName) {
        mutateUpdateWorkspaceName({ id, newName });
      }
    },
    [id, mutateUpdateWorkspaceName, workspaceDetails]
  );
  const validator = useCallback(
    (value: string) => {
      if (!workspaceDetails) return { valid: false, errorMessage: "No workspace details" };
      const {
        workspace: { type },
        isNameUnique
      } = workspaceDetails;
      return workspaceTabNameValidator({ value, type, index, isNameUnique });
    },
    [index, workspaceDetails]
  );
  const onCancel = useCallback(() => {
    return;
  }, []);
  const onMouseDown = useCallback(() => {
    appDispatch(uiProject_setInlineEditingWorkspaceId(null));
  }, [appDispatch]);
  const onMouseEnter = useCallback(() => {
    setMouseOver(true);
    setParentOpen(true);
    if (!tabMenuDetails) return;
    tabMenuDetails.setShowMenuButton(true);
  }, [tabMenuDetails]);
  const onMouseLeave = useCallback(() => {
    setMouseOver(false);
    setParentOpen(false);
    if (!tabMenuDetails) return;
    tabMenuDetails.setShowMenuButton(false);
  }, [tabMenuDetails]);
  const onClick = useCallback(() => {
    if (!editing) handleClick();
  }, [editing, handleClick]);

  if (!workspaceDetails || !tabMenuDetails) return null;

  return (
    <Tooltip
      open={!childControlOpen && !childMenuOpen && parentOpen}
      title={`${workspaceDetails.workspace.type === "Dashboard" ? labels.dashboard : labels.network} ${labels.tab}`}
      placement="top"
    >
      <span
        ref={tabRef}
        id={id}
        data-testid="WorkspaceHeaderTab"
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className={`Workspace_Header_Tab ${selected ? "Workspace_Header_Tab_Active" : ""}`}
      >
        <TabIconControl
          workspace={workspaceDetails.workspace}
          selected={selected}
          mouseOver={mouseOver}
          childOpen={childControlOpen}
          setChildOpen={setChildControlOpen}
        />

        <InlineEdit
          onCancel={onCancel}
          value={workspaceDetails.workspace.name}
          validator={validator}
          setEditing={setEditing}
          onUpdate={onUpdate}
          textColor={selected ? "white" : "black"}
          editing={editing}
          className="Workspace_Header_Tab_Label"
          dataTestId="WorkspaceHeaderTabLabel"
        />

        {tabMenuDetails.menu}
      </span>
    </Tooltip>
  );
});
WorkspaceTab.displayName = "WorkspaceTab";
