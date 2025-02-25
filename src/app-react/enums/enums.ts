export enum LocalStorage {
  DataExplorerOpenGroup = "AI-data-explorer-open-group",
  DataExplorerSelectedFolder = "AI-data-explorer-selected-folder",
  FileBrowserSelectedFolder = "AI-file-browser-selected-folder",
  PaletteOpenGroupsSuffix = "-palette-open-groups",
  PaletteDisplaySuffix = "-palette-display",
  PanelSizes = "AI-panel-sizes",
  LogPanelSize = "AI-log-panel-size",
  PanelSizesWorkspace = "AI-panel-sizes-workspace",
  WorkspaceLock = "AI-workspace-lock",
  NetworkDisplayNodeOpenGroups = "AI-network-display-node-open-groups"
}

export enum DragAndDropDataFormat {
  Data = "application/ai/datadef",
  Display = "application/ai/displaydef",
  Node = "application/ai/nodedef",
  Visualization = "application/ai/visualizationdef"
}
