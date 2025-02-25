import { Draggable } from "@hello-pangea/dnd";
import { memo } from "react";
import { WorkspaceTabDraggableProps } from "src/redux/types/ui/workspaceTabs";

export const WorkspaceTabDraggable = memo((props: WorkspaceTabDraggableProps) => (
  <Draggable key={props.id} draggableId={props.id} index={props.index} isDragDisabled={props.disabled}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="Workspace_Header_Tab_Draggable_Wrapper"
        style={provided.draggableProps.style}
      >
        {props.children}
      </div>
    )}
  </Draggable>
));
WorkspaceTabDraggable.displayName = "WorkspaceTabDraggable";
