import { createApi, fetchBaseQuery, QueryReturnValue } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "./utils/getApiBaseUrl";
import { TagsList } from "../types/redux/redux";
import { getLogPanelApiEndpoints } from "./endpoints/logPanel/logPanel";
import { getPropertiesApiEndpoints } from "./endpoints/properties/properties";
import { getDashboardVisualizationApiEndpoints } from "./endpoints/dashboardVisualization/dashboardVisualization";
import { getNetworkNodeApiEndpoints } from "./endpoints/networkNode/networkNode";
import { getNetworkConnectionApiEndpoints } from "./endpoints/networkConnection/networkConnection";
import { getWorkspaceItemApiEndpoints } from "./endpoints/workspaceItem/workspaceItem";
import { getNetworkRunApiEndpoints } from "./endpoints/networkRun/networkRun";
import { getWorkspaceApiEndpoints } from "./endpoints/workspace/workspace";
import { getProjectApiEndpoints } from "./endpoints/project/project";
import { getAboutDataApiEndpoints } from "./endpoints/aboutData/aboutData";
import { getVisualizationTypesApiEndpoints } from "./endpoints/visualizationTypes/visualizationTypes";
import { getNodeTypesApiEndpoints } from "./endpoints/nodeTypes/nodeTypes";
import { getDataExplorerEndpoints } from "./endpoints/dataExplorer/dataExplorer";
import { getDisplayNodesApiEndpoints } from "./endpoints/displayNodes/displayNodes";
import { getFileSystemApiEndpoints } from "./endpoints/fileSystem/fileSystem";
import { UseGetWorkspaceItemsQueryTyped, WorkspaceItems } from "../types/redux/workspaces";
import { getApplicationAnalyticsApiEndpoints } from "./endpoints/applicationAnalytics/applicationAnalytics";

// There should only be one call to createApi in the whole application
// see: https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics#defining-an-api-slice
export const appApi = createApi({
  reducerPath: "appDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: getApiBaseUrl() }),
  tagTypes: TagsList,
  endpoints: (builder) => ({
    ...getAboutDataApiEndpoints(builder),
    ...getDashboardVisualizationApiEndpoints(builder),
    ...getDataExplorerEndpoints(builder),
    ...getDisplayNodesApiEndpoints(builder),
    ...getLogPanelApiEndpoints(builder),
    ...getNetworkConnectionApiEndpoints(builder),
    ...getNetworkNodeApiEndpoints(builder),
    ...getNetworkRunApiEndpoints(builder),
    ...getNodeTypesApiEndpoints(builder),
    ...getProjectApiEndpoints(builder),
    ...getPropertiesApiEndpoints(builder),
    ...getVisualizationTypesApiEndpoints(builder),
    ...getWorkspaceApiEndpoints(builder),
    ...getWorkspaceItemApiEndpoints(builder),
    ...getFileSystemApiEndpoints(builder),
    ...getApplicationAnalyticsApiEndpoints(builder)
  })
});

export const {
  // About Data
  useGetAboutDataQuery,

  // Types
  useGetNodeTypesQuery,
  useGetVisualizationTypesQuery,

  // Project
  useGetCurrentProjectQuery,
  useNewProjectMutation,
  useLoadProjectMutation,
  useSaveProjectMutation,

  // Workspace
  useGetWorkspacesQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceIndexMutation,
  useUpdateWorkspaceNameMutation,
  useDeleteWorkspaceMutation,
  useExportAsPythonMutation,

  // Workspace Item
  useUpdateWorkspaceItemPositionMutation,
  useUpdateWorkspaceItemNameMutation,
  useDeleteWorkspaceItemMutation,
  useGetWorkspaceItemsQuery,

  // Network Node
  useCreateNetworkNodeMutation,

  // Dashboard Visualization
  useCreateDashboardVisualizationMutation,

  // Properties
  useGetPropertiesQuery,
  useGetPropertiesDataQuery,
  useUpdatePropertyMutation,
  useUpdatePropertyExpressionMutation,
  useGetPropertiesDataForTypeQuery,

  // Network Connection
  useGetNetworkConnectionsQuery,
  useCreateNetworkConnectionMutation,
  useDeleteNetworkConnectionMutation,

  // Network Run
  useStartNetworkRunMutation,
  useAbortNetworkRunMutation,
  useGetNetworkRunListQuery,

  // Log Panel
  useGetLogMessagesQuery,
  useClearLogMessagesMutation,

  // Data Explorer
  useGetDataFilesQuery,
  useGetColumnDetailsQuery,
  useGetColumnDetailsDataQuery,

  // Display Nodes
  useGetDisplayNodesQuery,

  // FileSystem
  useGetFolderContentsQuery,
  useGetFoldersContentsQuery,

  // ApplicationAnalytics
  useGetApplicationAnalyticsQuery,
  useFeedbackMutation
} = appApi;

export const useGetNetworkWorkspaceItemsQuery: UseGetWorkspaceItemsQueryTyped<"Network"> = (args) =>
  useGetWorkspaceItemsQuery(args) as QueryReturnValue<WorkspaceItems<"Network">>;

export const useGetDashboardWorkspaceItemsQuery: UseGetWorkspaceItemsQueryTyped<"Dashboard"> = (args) =>
  useGetWorkspaceItemsQuery(args) as QueryReturnValue<WorkspaceItems<"Dashboard">>;
