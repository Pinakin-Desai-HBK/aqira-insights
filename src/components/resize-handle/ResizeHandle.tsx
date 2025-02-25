import { PanelResizeHandle } from "react-resizable-panels";

const ResizeHandle = ({ className = "" }: { className?: string }) => (
  <PanelResizeHandle className={["ResizeHandleOuter", className].join(" ")}>
    <div data-testid="ResizeHandleInner" className={"ResizeHandleInner"}></div>
  </PanelResizeHandle>
);

export default ResizeHandle;
