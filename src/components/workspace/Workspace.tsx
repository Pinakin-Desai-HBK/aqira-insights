import { memo, useMemo } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import ResizeHandle from "../resize-handle/ResizeHandle";
import PropertiesPanel from "../properties/PropertiesPanel";
import usePopoutManager from "src/popout-manager/usePopoutManager";
import { WorkspacePlaceholder } from "./placeholders/WorkspacePlaceholder";
import LogPanel from "../log-panel/LogPanel";
import LandingPage from "./placeholders/LandingPage";
import { WorkspaceHeader } from "../workspace-header/WorkspaceHeader";
import PalettePanelGroup from "../sidebar/PalettePanelGroup";
import { useAppDispatch, useAppSelector } from "src/redux/hooks/hooks";
import { WorkspaceCanvas } from "../workspace-canvas/WorkspaceCanvas";
import { selectStore_UI_Workspace, uiWorkspace_setMouseOver } from "src/redux/slices/ui/workspace/workspaceSlice";
import { selectStore_UI_LogPanel_ShowLogPanel } from "src/redux/slices/ui/logPanel/logPanelSlice";
import { WorkspaceProps } from "src/redux/types/ui/workspace";
import { popoutDetails } from "src/popoutDetails";
import { make_selectStore_UI_Project_ForWorkspace } from "src/redux/slices/ui/project/combinedSelectors";

export const Workspace = memo(({ selectedPaletteItems }: WorkspaceProps) => {
  const projectSelector = useMemo(make_selectStore_UI_Project_ForWorkspace, []);
  const { poppedWorkspaceIds, selectedWorkspace, workspaces } = useAppSelector(projectSelector);
  const { closePopout } = usePopoutManager();
  const { isPopout } = popoutDetails;
  const appDispatch = useAppDispatch();

  const showLogPanel = useAppSelector(selectStore_UI_LogPanel_ShowLogPanel);

  const { locked, propertiesVisible } = useAppSelector(selectStore_UI_Workspace);
  const showClosePopout = useMemo(() => {
    return !isPopout && selectedWorkspace && poppedWorkspaceIds.includes(selectedWorkspace.id);
  }, [isPopout, poppedWorkspaceIds, selectedWorkspace]);

  const arePalletItemsSelected = useMemo(() => selectedPaletteItems.length > 0, [selectedPaletteItems.length]);

  return (
    <PanelGroup
      direction="horizontal"
      data-testid="AI-Workspace-Panel-Group"
      id="AI-Workspace-Panel-Group"
      autoSaveId="AI-Workspace-Panel-Group"
    >
      {arePalletItemsSelected && (
        <>
          <Panel
            className="PalettePanel"
            id="AI-panel-group"
            order={1}
            style={{ minWidth: "230px" }}
            defaultSize={22.5}
          >
            <PalettePanelGroup items={selectedPaletteItems} />
          </Panel>
          <ResizeHandle />
        </>
      )}
      <Panel id="AI-Workspace-Panel-Right" order={2} style={{ minWidth: "400px" }}>
        <PanelGroup
          data-testid="AI-Workspace-Panel-Group-Right"
          id="AI-Workspace-Panel-Group-Right"
          autoSaveId="AI-Workspace-Panel-Group-Right"
          direction="horizontal"
        >
          <Panel data-testid="AI-Workspace-Main" id="AI-Workspace-Main" order={1} style={{ minWidth: "200px" }}>
            <PanelGroup
              data-testid="AI-Workspace-main-container"
              id="AI-Workspace-main-container"
              autoSaveId="AI-Workspace-main-container"
              direction="vertical"
            >
              <Panel
                data-testid="AI-Workspace-Main-Inner"
                id="AI-Workspace-Main-Inner"
                order={1}
                style={{ minHeight: "200px" }}
              >
                <>
                  {!isPopout && <WorkspaceHeader />}
                  {workspaces === undefined || workspaces?.length === 0 ? (
                    <LandingPage />
                  ) : showClosePopout ? (
                    <WorkspacePlaceholder
                      closePopoutHandler={() => selectedWorkspace && closePopout && closePopout(selectedWorkspace.id)}
                    />
                  ) : (
                    <div
                      onMouseLeave={() => appDispatch(uiWorkspace_setMouseOver(false))}
                      onMouseEnter={() => appDispatch(uiWorkspace_setMouseOver(true))}
                      className={`Workspace ${locked ? "WorkspaceLocked" : "WorkspaceUnlocked"}`}
                      data-testid="Workspace"
                      style={{ backgroundColor: "#F9FCFF", height: isPopout ? "100%" : "calc(100% - 40px)" }}
                    >
                      <WorkspaceCanvas />
                    </div>
                  )}
                </>
              </Panel>
              {showLogPanel && !isPopout && (
                <>
                  <ResizeHandle />
                  <Panel
                    data-testid="AI-log-panel"
                    id="AI-log-panel"
                    order={2}
                    style={{ minHeight: "200px" }}
                    defaultSize={32}
                  >
                    <LogPanel />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>
          {propertiesVisible && (
            <>
              <ResizeHandle />
              <Panel
                data-testid="AI-Properties"
                id="AI-Properties"
                order={2}
                style={{ minWidth: "200px" }}
                defaultSize={16}
              >
                <PropertiesPanel />
              </Panel>
            </>
          )}
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
});
Workspace.displayName = "Workspace";
