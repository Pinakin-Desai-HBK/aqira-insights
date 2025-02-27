import { createRef, memo, useEffect, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { StrictDroppable } from "src/insights/components/workspace-header/tabs/dndSupport/StrictDroppable";
import { WorkspaceTabDraggable } from "src/insights/components/workspace-header/tabs/dndSupport/WorkspaceTabDraggable";
import { useAppDispatch, useAppSelector } from "src/insights/redux/hooks/hooks";
import { uiProject_setScrollToSelected } from "src/insights/redux/slices/ui/project/projectSlice";
import { ScrollTo } from "src/insights/redux/types/ui/header";
import { Scroller } from "src/insights/components/scroller/Scroller";
import { useHandleTabMoved } from "src/insights/redux/hooks/useHandleTabMoved";
import { WorkspaceTab } from "src/insights/components/workspace-header/tabs/WorkspaceTab";
import { make_selectStore_UI_Project_ForWorkspaceTabs } from "src/insights/redux/slices/ui/project/combinedSelectors";

export const WorkSpaceTabs = memo(() => {
  const handleTabMoved = useHandleTabMoved();
  const projectSelector = useMemo(make_selectStore_UI_Project_ForWorkspaceTabs, []);
  const { scrollToSelected, selectedWorkspace, workspaces } = useAppSelector(projectSelector);
  const scrollToRef = createRef<ScrollTo | null>();
  const appDispatch = useAppDispatch();
  useEffect(() => {
    if (scrollToSelected && selectedWorkspace && workspaces && scrollToRef.current) {
      const workspace = workspaces.find((workspace) => workspace.id === selectedWorkspace.id);
      if (!workspace) {
        return;
      }
      appDispatch(uiProject_setScrollToSelected(false));
      setTimeout(() => {
        if (scrollToRef.current)
          scrollToRef.current(workspaces.findIndex((workspace) => workspace.id === selectedWorkspace.id));
      }, 0);
    }
  }, [appDispatch, scrollToRef, scrollToSelected, selectedWorkspace, workspaces]);

  return (
    <DragDropContext onDragEnd={handleTabMoved}>
      <StrictDroppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <Scroller setRef={provided.innerRef} scrollToRef={scrollToRef} {...provided.droppableProps}>
            {workspaces.map(({ id }, index) => (
              <WorkspaceTabDraggable key={id} id={id} index={index} disabled={workspaces.length < 2}>
                <WorkspaceTab
                  key={id}
                  id={id}
                  selected={selectedWorkspace ? selectedWorkspace.id === id : false}
                  aria-controls={`simple-tabpanel-${index}`}
                  index={index}
                />
              </WorkspaceTabDraggable>
            ))}
            {provided.placeholder}
          </Scroller>
        )}
      </StrictDroppable>
    </DragDropContext>
  );
});
WorkSpaceTabs.displayName = "WorkSpaceTabs";
