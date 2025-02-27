import { memo, useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import NetworkContent from "./NetworkContent";
import { TypedWorkspace } from "src/insights/redux/types/redux/workspaces";
import Box from "@mui/material/Box";

const NetworkContentProvider = memo(({ workspace }: { workspace: TypedWorkspace<"Network"> }) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  return (
    <div className={`Workspace_Canvas`} data-testid="NetworkCanvas" style={{ width: "100%", height: "50%" }}>
      <Box sx={{ display: "flex", height: "-webkit-fill-available" }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper} />
          <NetworkContent workspace={workspace} />
        </ReactFlowProvider>
      </Box>
    </div>
  );
});
NetworkContentProvider.displayName = "NetworkContentProvider";

export default NetworkContentProvider;
