/*
  This file contains all the labels used in the application in order to make it easier to manage and update them.
  
  Please keep the format consistent and the label keys simple.

  Please don't share labels across locations.

    <ComponentName/functionName>: {
      <labelKey>: "Label Text"
    }

  For each file that uses labels, import the appLabels and declare a top level variable that references the specific labels for that file, for example:

    const labels = appLabels.DashboardCanvasCustomControls;

  If a file has two or more labels that wouild require the same key then add a suffix to the key to make it unique, for example:

    openProject: "Opening project...",
    openProject_StatusMessage: "Opening project...",
*/

export const appLabels = {
  WorkspaceTab: {
    network: "Network",
    dashboard: "Dashboard",
    tab: "tab"
  },

  HeaderMenu: {
    projectMenu: "Project menu"
  },

  PaletteGroups: {
    nodes: "nodes",
    visualizations: "visualizations"
  },

  PaletteItem: {
    node: "node",
    visualization: "visualization"
  },

  ColumnDetailsDialogContent: {
    unableToEvaluateColumnDetails: "Unable to evaluate column details",
    loadingColumnDetails: "Loading column details..."
  },

  getColumnDetailsDefinitions: {
    name: "Name",
    type: "Type",
    units: "Units",
    min: "Min",
    max: "Max",
    mean: "Mean",
    sum: "Sum",
    sumSquare: "Sum Square",
    numberOfPointsInSum: "Number of Points in Sum",
    rootMeanSquare: "RMS",
    standardDeviation: "Standard Deviation"
  },

  getHeaderItems: {
    filename: "Filename",
    folder: "Folder",
    indexes: "Indexes",
    dataColumns: "Data Columns",
    created: "Created",
    modified: "Modified",
    size: "Size"
  },

  getIndexDetailsItems: {
    name: "Name",
    type: "Type",
    units: "Units",
    length: "Length",
    numPoints: "Number of Points",
    isoBase: "Base",
    isoIncrement: "Sample Rate",
    indexDetails: "Index Details",
    firstValue: "First Value",
    lastValue: "Last Value"
  },

  DataExplorerOptions: {
    refresh: "Refresh",
    selectFolder: "Select Folder",
    sort: "Sort"
  },

  DashboardCanvasCustomControls: {
    zoomIn: "Zoom In",
    resetView: "Reset View",
    zoomOut: "Zoom Out",
    locked: "Locked",
    unlocked: "Unlocked"
  },

  NetworkCanvasCustomControls: {
    zoomIn: "Zoom In",
    resetView: "Reset View",
    zoomOut: "Zoom Out",
    arrange: "Arrange"
  },

  NetworkRunMap: {
    runNetwork: "Run Network",
    stopNetworkRun: "Stop Network Run"
  },

  DataExplorer: {
    data: "Data",
    search: "Search",
    dataFiles: "Data Files",
    displayNodes: "Display Nodes"
  },

  DataFileTooltip: {
    dataInformation: "Data Information",
    path: "Path",
    created: "Created",
    modified: "Modified",
    size: "Size",
    viewDetails: "View Details"
  },

  DisplayNodeTooltip: {
    displayNodeInformation: "Display Node Information",
    network: "Network",
    displayNode: "Display Node"
  },

  ColumnDetailsMessage: {
    retrievingColumnDetails: "Retrieving column details..."
  },

  actions: {
    delete: "Delete",
    rename: "Rename",
    openInNewWindow: "Open in new window",
    newNetwork: "New Network",
    createDashboard: "Create Dashboard",
    createNewProject: "Create New Project",
    open: "Open",
    save: "Save",
    saveAs: "Save As",
    switchToExpression: "Switch To Expression",
    switchToValue: "Switch To Value",
    editExpression: "Edit Expression",
    newDashboard: "New Dashboard",
    viewDataInformation: "View Data Information",
    exportForAqira: "Export for Aqira",

    viewDataInformationForThisFile: "View data information for this file",
    switchThisPropertyToBeAnExpression: "Switch this property to be an expression",
    switchThisPropertyToBeAValue: "Switch this property to be a value",
    editTheExpressionForThisProperty: "Edit the expression for this property",
    deleteThisTab: "Delete this tab",
    renameThisTab: "Rename this tab",
    openThisTabInANewWindow: "Open this tab in a new window",
    createANewNetwork: "Create a new network",
    createANewDashboard: "Create a new dashboard",
    createANewProject: "Create a new project",
    openAProject: "Open a project",
    saveTheProject: "Save the project",
    saveAProjectAs: "Save the project as a new project",
    exportTheNetworkForAqira: "Export the network to Python for Aqira"
  },

  useDataItemActions: {
    details: "Details"
  },

  useProjectIO: {
    exportForAqira: "Export for Aqira",
    exportingProjectForAqira: "Exporting project for Aqira...",
    exportForAqiraSuccessful: "Export for Aqira successful",
    networkExportedForAqiraSuccessfully: "Network exported for Aqira successfully",
    exportForAqiraFailed: "Export for Aqira Failed",
    networkExportForAqiraUnsuccessful: "Network export for Aqira unsuccessful",
    errorExportingForAqira: "Error exporting for Aqira",
    thereWasAnErrorExportingTheProjectForAqira: "There was an error exporting the project for Aqira:",
    openProject: "Open Project",
    openingProject: "Opening project...",
    errorOpeningProject: "Error Opening Project",
    thereWasAnErrorOpeningTheSpecifiedProject: "There was an error opening the specified project:",
    advantageInsightsProject: "Advantage Insights project",
    advantageInsightsProject_Save: "Advantage Insights project",
    open: "Open",
    openProject_StatusTitle: "Open Project",
    openProject_StatusMessage: "Opening project...",
    selectProjectToOpen: "Please select a project to open",
    projectName: "Project Name",
    pleaseSelectAProjectToOpen: "Please select a project to open",
    saveProject: "Save Project",
    saveProjectAs: "Save Project As",
    savingProject: "Saving project...",
    errorSavingProject: "Error Saving Project",
    thereWasAnErrorSavingTheProject: "There was an error saving the project:",
    pleaseSpecifyAProjectFileNameToSaveTo: "Please specify a project file name to save to",
    projectName_Save: "Project Name",
    save: "Save",
    aqiraPythonRunner: "Aqira Python Runner",
    pleaseSpecifyAFileNameToExportTheProjectForAqira: "Please specify a file name to export the project for Aqira",
    fileName: "File Name",
    export: "Export",
    continue: "Continue"
  },

  dataPanelExtraReducers: {
    unableToEvaluateColumnDetails: "Unable to evaluate column details"
  },

  Feedback: {
    categoriesSubtitle: "Select one or more items from below.",
    categoriesTitle: "Tell us more",
    feedback: "Feedback",
    mainSubtitle: "Help to improve our service by sharing your thoughts with us.",
    mainTitle: "We value your feedback",
    networkConnectionFailureLabel: "Network connection failure",
    orConnectToOur: "or connect to our",
    supportWebsite: "support website",
    tellUsMoreText: "If you want to tell us more, please contact your HBK representative",
    unavailableText:
      "It is currently not possible to submit feedback. Please check your internet connection and try again."
  },

  FeedbackStatus: {
    submittingText: "Submitting feedback...",
    doneButtonLabel: "Done",
    errorTitle: "There was an error",
    errorSubtitle: "Please try again later.",
    successTitle: "Thank You",
    successSubtitle: "We appreciate your feedback."
  },

  About: {
    title: "About"
  },

  AboutPanelAccordion: {
    details: "details"
  },

  PropertiesGroup: {
    properties: "properties"
  },
  // Error message constants
  VisualizationErrorMessages: {
    noConnection: "No data source: drag data onto this visualization to set the connection property",
    connectionFormat: "Configuration error: connection property is not in the correct format",
    dataNotAvailable: "Data specified in connection property not available",
    dataNotAvailableNetwork: "Data specified in connection property not available: run the network to generate data",
    dataNotAvailableDirect:
      "Data specified in connection property not available: check that the supplied data is valid for this visualization",
    dataInvalid:
      "Data specified in connection property not available: check that the supplied data is valid for this visualization"
  }
};
