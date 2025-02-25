import { memo, useRef } from "react";
import Box from "@mui/material/Box";
import { ReactFlowProvider } from "reactflow";
import DashboardContent from "./DashboardContent";
import { TypedWorkspace } from "src/redux/types/redux/workspaces";

const DashboardContentProvider = memo(({ workspace }: { workspace: TypedWorkspace<"Dashboard"> }) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  return (
    <div className={`Workspace_Canvas`} data-testid="DashboardCanvas" style={{ width: "100%", height: "50%" }}>
      <Box sx={{ display: "flex", height: "-webkit-fill-available" }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper} />
          <DashboardContent workspace={workspace} />
        </ReactFlowProvider>
      </Box>
    </div>
  );
});
DashboardContentProvider.displayName = "DashboardContentProvider";

export default DashboardContentProvider;
